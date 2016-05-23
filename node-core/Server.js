/*
 * Copyright (c) 1988 - Present @MaxVerified on behalf of 5ive Design Studio (Pty) Ltd. 
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

(function () {
	
	"use strict";
    
    /** @define{number} Number of ms to wait for the server to start */
	var SETUP_TIMEOUT = 5000; // wait up to 5 seconds for server to start

    /** @define{number} Number of ms between pings to parent process */
	var PING_DELAY = 1000; // send ping to parent process every 1 second
    
	var fs 					= require("fs"),
		http 				= require("http"),
		WebSocket 			= require("./thirdparty/ws"),
		EventEmitter 		= require("events").EventEmitter,
		Logger				= require("./Logger"),
		ConnectionManager 	= require("./ConnectionManager"),
		DomainManager 		= require("./DomainManager");

    /** 
     * @constructor
     * The Server module is a singleton object that manages both the
     * connection to the parent process (over stdin/stdout) and to clients
     * over WebSockets.
     *
     * Server inherits from the EventEmitter class and exports itself
     * as the module.
     */
	var Server = module.exports = new EventEmitter();
    
    /**
     * @private
     * @type{number} unique IDs for messages to parent process
     */
	var _commandCount = 1;
    
    /**
     * @private
     * @type{http.Server} the HTTP server
     */
	var _httpServer = null;

    /**
     * @private
     * @type{ws.WebSocketServer} the WebSocket server
     */
	var _wsServer = null;
	var _user = null;

	/**
     * @private
     * 
     * sends message via websocket which is listened to by ConnectionManager->which sends the message to NodeConnection 
     * which adds "on" eventListener...$rootScope waits and listens to NodeConnection's "on" events in Front-End.
     *
     * @param {ws.WebSocketServer}
     * 
     * /
	function sqlListner ( ws ) {

		//var SQLQuery = new QDb();

		//ConnectionManager.createConnection( ws );

		ws.on( 'message', function(data) {

			var msgContent = JSON.parse(data);

			/* 
			 * DATA {Object}
			 *
			 * {
			 * 	command: String
			 * 	parameters: Array
			 * }
			 * 
			 * DATA -> msgContent.parameters
			 * 
			 * [
			 * 	0: {WebSocket}
			 * 	1: "String.action"
			 * 	2: {Object.params}
			 * ]
			 * 
			 * /

			//switch( msgContent.command  ) {
			switch( msgContent.parameters[1] ) {

				case 'authenticate': 

					//DomainManager.executeCommand( ws, msgContent.id, msgContent.domain, msgContent.command, msgContent.parameters );
					
					DBMine.DBAuthenticate( _mysqlServer, msgContent.parameters[2],  function(e) {

						ws.send( JSON.stringify(
							{
								type: 'dbQuery', 
								message: {
									"timestamp": 	new Date(),
									"response": 	JSON.stringify(e) //'Roundtrip time: ' + (Date.now() - parseInt(data)) + 'ms'
								}
							}
						));

					});
					
					break;

				case 'get':

					DBMine.DBGetData( _mysqlServer, msgContent.parameters[2], function(e) {
				
						ws.send( JSON.stringify(
							{
								type: 'dbQuery', 
								message: {
									"timestamp": 	new Date(),
									"response": 	JSON.stringify(e) //'Roundtrip time: ' + (Date.now() - parseInt(data)) + 'ms'
								}
							}
						));

					});

					break;

			}

		});

	}

    /**
     * Stops the server and does appropriate cleanup.
     * Emits an "end" event when shutdown is complete.
     */
	function stop() {

		Logger.info( "[Server] stopping" );
        
		if ( _wsServer ) {
			try {
				_wsServer.close();
			} catch (err1) { }
		}
		if ( _httpServer ) {
			try {
				_httpServer.close();
			} catch ( err2 ) { }
		}
        
		ConnectionManager.closeAllConnections();

		Logger.info( "[Server] stopped" );

		Server.emit("end");
		Server.removeAllListeners();

	}
	
	/*
	 * Starts the server.
	 * ------------------------------------------------*/
	function start() {
        
		function sendCommandToParentProcess() {

			var cmd = "\n\n" + (_commandCount++) + "|" + Array.prototype.join.call(arguments, "|") + "\n\n";
			process.stdout.write( cmd );

		}

		function httpRequestHandler( req, res ) {

			if (req.method === "GET") {

				//res.setHeader("Access-Control-Allow-Origin", "*");

				if (req.url === "/api" || req.url.indexOf("/api/") === 0) {

					res.setHeader("Content-Type", "application/json");
					res.end(
						JSON.stringify( DomainManager.getDomainDescriptions(), null, 4 )
					);
				
				} else {

					res.setHeader("Content-Type", "text/plain");
					res.end("HSE Server\n");
				}
			} else { // Not a GET request

				res.statusCode = 501;
				res.end();
			}

		}

		
		function setupStdin() {
            // re-enable getting events from stdin
			try {

				process.stdin.resume();
				process.stdin.setEncoding("utf8");

			} catch (e) {

                // Couldn't resume stdin, so something is terribly wrong
				Logger.error("[Server] unable to resume stdin, stopping");
				stop();
			}
        
            // set up event handlers for stdin
			process.stdin.on("data", function (data) {
                // no-op, but make sure we read the data so the buffer 
				// doesn't fill up
			});
        
			process.stdin.on("end", function receiveStdInClose() {
				Logger.info("[Server] stopping because stdin closed");
				stop();
			});

		}

		function setupStdout() {
            // Routinely check if stdout is closed. Stdout will close when our
            // parent process closes (either expectedly or unexpectedly) so this
            // is our signal to shutdown to prevent process abandonment.
            //
            // We need to continually ping because that's the only way to actually
            // check if the pipe is closed in a robust way (writable may only get
            // set to false after trying to write a ping to a closed pipe).
			setInterval(function () {

				if ( !process.stdout.writable) {
					// If stdout closes, our parent process has terminated or
					// has explicitly closed it. Either way, we should exit.
					Logger.info("[Server] stopping because stdout closed");
					stop();

				} else {

					try {
						sendCommandToParentProcess("ping");
					} catch (e) {
						Logger.info("[Server] stopping because stdout was not writable");
						stop();
					}
				}
			}, PING_DELAY);

		}

		/** /
		function setupMySql () {

			// MySQL Config

			_mysqlServer = mysql.createConnection( _SQL_db_config );
			
			//_mysqlServer = mysql.createConnection("mysql://user:pass@host/database?insecureAuth=true");
			//_mysqlServer = mysql.createConnection("mysql://prepetro_pamela:TG38;0l7OzTr@192.185.170.237/prepetro_investment?insecureAuth=true");
			
			// The server is either down or restarting (takes a while sometimes).
			_mysqlServer.connect( function(err) {

				//console.log('mySql connected');
				
				//Server.emit("sql-connected");

				if( err ) {
					console.log('error when connecting to db:', err);
					// We introduce a delay before attempting to reconnect, to avoid a hot loop
					setTimeout( setupMySql, 2000 );
				}
			});

			_mysqlServer.on( 'error', function(err) {

				//console.log('db error', err);

				// Connection to the MySQL server is usually lost due to either server restart
				if( err.code === 'PROTOCOL_CONNECTION_LOST' ) {	

					setupMySql();

				} else {
			
					throw err; 
				}
			
			});

        }
        /**/

		function setupHttpAndWebSocketServers( callback, timeout ) {
            
            var timeoutTimer = null;
            var httpServer = null;
			                
            if ( timeout ) {
                timeoutTimer = setTimeout(function () {
                    callback("ERR_TIMEOUT", null);
                }, timeout);
            }
        
            httpServer = http.createServer( httpRequestHandler );
            
            httpServer.on( "error", function () {
                if ( callback ) {
                    callback( "ERR_CREATE_SERVER", null );
                }

			});

			// MySQL Connection
			//setupMySql();

			httpServer.listen( 0, "127.0.0.1", function () {

				var wsServer = null;
				var address = httpServer.address();

				if ( address !== null ) {

					httpServer.removeAllListeners( "error" );
					httpServer.on( "error", function () {
						
						Logger.error( "[Server] stopping due to HTTP error", arguments );
						stop();
                    });

					if ( wsServer == null ) {

						wsServer = new WebSocket.Server( {server: httpServer} );
					
					}
					
					wsServer.on( "error", function () {
						Logger.error( "[Server] stopping due to WebSocket error", arguments );
						stop();
					
					});
					
					wsServer.on( "connection", function(ws) {

						ConnectionManager.createConnection( ws );
						
						//sqlListner( ws );

					});

					if ( timeoutTimer ) {
						clearTimeout( timeoutTimer );
					}
                    
					callback( null,
						{
							httpServer: httpServer,
							wsServer : 	wsServer,
							port : 		address.port
					});
   
                } else {
                    // address is null
                    // This shouldn't happen, because if we didn't get a socket
                    // we wouldn't have called this callback
					if ( timeoutTimer ) {
						clearTimeout( timeoutTimer );
					}

					if ( callback ) {
						callback( "ERR_UNKNOWN", null );
					}
              
				}
            });

		}      
        
        // Do initialization
        Logger.info( "[Server] beginning startup" );
        
		setupStdin();
		setupStdout();

		setupHttpAndWebSocketServers( function ( err, servers ) {
            
            if ( err ) {
            
                Logger.error(
                    "[Server] stopping due to error while starting http/ws servers: "
                        + err
                );
                stop();
            
            } else {
                
				Logger.info("[Server] serving on port", servers.port);
                
                //servers.httpServer.listen(servers.port);
				_httpServer = servers.httpServer;
				_wsServer = servers.wsServer;
               
                // tell the parent process what port we're on
				sendCommandToParentProcess( "port", servers.port );
            
            }
		
		}, SETUP_TIMEOUT );
		
		DomainManager.loadDomainModulesFromPaths( ["./BaseDomain"] );
		
		Logger.info("[Server] startup complete");

	}

    // Public interface
    Server.start                    = start;
    Server.stop                     = stop;


}());
