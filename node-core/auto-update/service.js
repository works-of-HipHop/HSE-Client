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

"use strict";

var os 			= require("os"),
	path 		= require('path'),
	url 		= require('url'),
	http 		= require('http'),
	nodeUtil	= require("util"),
	fs 			= require("fs-extra");

var unzip		= require('unzip'),
	later 		= require('later'),
	GetMac		= require('getmac'),
	mkdirp 		= require('node-mkdirp'),
	wincmd 		= require('node-windows'),
	//notifier 	= require('node-notifier').WindowsToaster,
	exec 		= require("child_process").exec,
	spawn 		= require('child_process').spawn,
	execFile 	= require("child_process").execFile,
	EventLogger = require('node-windows').EventLogger;

var Q5log 		= new EventLogger('Q-Not5y');
var DBMine 		= require( path.join( __dirname, '../', 'QDb') );

// LogTime / Ping MySQL
function logTime() {

	var cmdExec;
	var notificationPath = path.join( __dirname, '../', 'www/thirdparty/apps/' ); //+ os.arch().indexOf('64')>0 ? 'notifu64.exe':'notifu.exe'; //notifu64.exe

	try {

		var appVersion 	= fs.readJsonSync( path.join( __dirname, '../', "version.json" ) );

		console.log( '\nNot5y Service: ', new Date(), ' version: ' + appVersion.full );

		/** /

		var notice = new notifier({
			withFallback: false, // Try Windows Toast and Growl first? 
			customPath: void 0 // Relative path if you want to use your fork of notifu 
		});

		notice.notify({
				title: "Q-5ive!",
				message: "Yo dude",
				sound: true,				// true | false. 
				time: 5000,					// How long to show balloon in ms 
				wait: true,				// Wait for User Action against Notification 
			}, function(error, response) {

				if( error ) {

					console.log( 'GROWL ERROR: ', error);

				} else {

					console.log( 'GROWL: ', response);
				}
				
			}
		);/**/

		/** /
		var noticeMe  = notificationPath + 'notifu64 /p Q-Not5y /m Notifications server is active.';

		exec( noticeMe, function ( error, stdout, stderr ) {

			if ( error !== null ) {

				console.log('Error HSE Notifications: ', error, stderr);

			} else {

				console.log('HSE Notifications: ', stdout);

			}

		});
		/**/

		/** /
		cmdExec = spawn( notificationPath, [
		  '/p', 'Q-Not5y',
		  '/m', 'Notifications server is active.'
		]);

		cmdExec.stdout.on( 'error', function(chunk) {
			console.log( '\nNot5y Service Message Error: ', chunk );
		});

		cmdExec.stdout.on( 'exit', function(chunk) {
			console.log( '\nNot5y Service Message Data: ', chunk );
		});

		cmdExec.stdout.on( 'exit', function(chunk) {
			console.log( '\nNot5y Service Message: ', chunk );
		});/**/

	} catch (e) {

		console.log('version.json error:', e);

	}
}

function upd8app() {

	var stats;

	try {
	
		stats = fs.statSync( path.join( __dirname, '../', 'hse-update.zip') );
	
		console.log("Update Found.", stats);

		// Finding HSE application

		wincmd.list( function(svc){

			//console.log( 'Running Processes: ', svc);

			var hse_processID;
			var no_of_processes = svc.length;

			for (var i = 0; i < no_of_processes; i++) {

				if( svc[i].ImageName == "HSE-Client.exe" ) {

					hse_processID = svc[i].PID;

					break;
				}

			};

			// Close HSE

			if( hse_processID ) {

				exec( "TASKKILL /F /IM " + hse_processID + "", function ( error, stdout, stderr ) {

					if ( error !== null ) {

						console.log('Error Closing HSE: ', hse_processID, error);

					} else {

						console.log('HSE Closed: ', hse_processID, process.env.HSEEXE);

						_update_and_launch();

					}

				});

			} else {

				console.log('HSE Not Running', process.env.HSEEXE);

				_update_and_launch();

			}

		}, false);
	
	} catch (e) {

		console.log("No updates [" + path.join( __dirname, '../', 'hse-update.zip') + "] available.", e);
	
	}

}

// will fire every 5 minutes
// execute logTime one time on the next occurrence of the text schedule
//var timer = later.setInterval( logTime, later.parse.text('every 5 min') );

// clear the interval timer when you are done
//timer.clear();

function _updateHSE( callback ) {

	fs.createReadStream( path.join( __dirname, '../', 'hse-update.zip') ).pipe( unzip.Extract({ path: process.env.TEMP }) ).on('error', function(err) {

		console.log('Error Extracted to Temp Folder:', err );

		callback( true, err);

	})
	.on( 'close', function () {

		console.log('Updates Extracted to Temp Folder: ' + process.env.TEMP);

		var files 		= fs.readdirSync( process.env.TEMP + '/HSE-Client-master' );
		var no_of_files = files.length;
		var count 		= 0;

		for ( var i in files ) {

			var currentFile = process.env.TEMP + '/HSE-Client-master/' + files[i];
			var stats 		= fs.statSync(currentFile);
		
			if ( stats.isDirectory() || stats.isFile() ) {

				try {

					//fs.emptyDirSync( path.join( __dirname, '../', files[i] ) );
				
					fs.copySync( currentFile, path.join( __dirname, '../',  files[i] ), { clobber: true, preserveTimestamps: true } );
					
					console.log( currentFile + " successfully copied.");
				
				} catch (err) {
					
					callback( true, err );

					return;
				
				};

			}

		}

		callback( false, 'Updates successfully copied.' );
			
	});

}

function _update_and_launch() {

	_updateHSE( function(err, db) {

		if( err ) {

			console.log('Error updating HSE: ', db);

		} else {

			try {

				// Delete hse-update.zip
				fs.removeSync( path.join( __dirname, '../', 'hse-update.zip') );

				// Delete Temp extraction too
				fs.removeSync( process.env.TEMP + '/HSE-Client-master' );

				console.log( 'HSE updated and ready to relaunch: ' , db);

				// ReLaunch HSE
				/** /
				execFile( "" + path.join( __dirname, '../', 'HSE-Client.exe') + "", function ( error, stdout, stderr ) {

					if ( error !== null ) {

						console.log('Error Relaunching HSE: ', error, stderr, path.join( __dirname, '../', 'HSE-Client.exe'));

					} else {

						console.log('HSE Relaunched: ', stdout);

					}

				});/**/

			} catch (e) {

				console.log( 'Error _update_and_launch(): ', e );

			}

		}

	});

}

/**
 * @private
 *
 * @type HTTP WEB Server
 *
 */
var server 	= http.createServer( httpRequestHandler ).listen( 5000, '127.0.0.1', function() {

	var address = server.address();

	if ( address !== null ) {

	} else {

	}

}).on( "error", function () {
	
	console.log('HSE SERVER ERROR: ', new Date());

});

/**
 * @private
 *
 * @param {callback.<Function>}
 *
 * HTTP Server Request Handler
 */
function httpRequestHandler( req, res ) {

	res.setHeader("Content-Type", "application/json");

	if (req.url === "/upd8" || req.url.indexOf("/upd8/") === 0) {

		//_processRequest( req, res );

		try {

			var appVersion 	= fs.readJsonSync( path.join( __dirname, '../../', "version.json" ) );

			console.log( '\nNot5y Service: ', new Date(), ' version: ' + appVersion.full );

			upd8app();

			res.end( 'HSE Upd8ing ' + new Date() + ' version: ' + appVersion.full );

		} catch (e) {

			res.end( 'HSE Upd8 version.json error:', e );

			console.log('version.json error:', e);

		}		
			
	} else {

		GetMac.getMac( function( err, macAddress ) {

			if( err ) {

			} else {

				res.end( 'HSE Upd8 Server running at http://127.0.0.1:5000/api/ on ' + macAddress + ' ' + os.hostname() );

			}

		});

	}

}

function _processRequest( req, res, num, startTime) {
	
	if (!startTime) startTime = new Date();

	var parsedURL = url.parse(req.url, true);

	if (num === undefined) {
	
		return process.nextTick(function() {
			_processRequest( req, res, 0);
		});
	}

	if (num >= 5) {
	
		_apiProcessor( req, res, startTime );
	
	} else {
		// 1ms of computation
		var targetTime = (new Date() - startTime) + 1;
		while (new Date() - startTime < targetTime);
		_processRequest( req, res, num + 1, startTime);
	
	}

}

function _apiProcessor( req, res, startTime ) {

	var parsedURL = url.parse(req.url, true);

	GetMac.getMac( function( err, macAddress ) {

		if( err ) {

		} else {

			if (req.method === "GET" && parsedURL.query.action.toUpperCase() === "GET") {
			
				DBMine.DBGetData( _mysqlServer, {

						'type': parsedURL.query.model

					}, function(error, msg) {

						res.statusCode = 200;

						if( error ) {

							console.log( new Date(), 'Q-5 Noti5y REQUEST running at http://127.0.0.1:5000' + req.url + ' on ' + macAddress + ' ' + os.hostname(), 'Failed', error );

							res.end( JSON.stringify({
								'error'		: true,
								'message'	: error
							}) );

						} else {

							console.log( new Date(), 'Q-5 Noti5y REQUEST running at http://127.0.0.1:5000' + req.url + ' on ' + macAddress + ' ' + os.hostname() + ' in ' + (new Date() - startTime) + 'ms\n', 'Success', msg );

							res.end( JSON.stringify({
								'error'		: false,
								'message'	: msg
							}) );

						};

				});

			} else if ( req.method === "PUT" ) {

			} else if ( req.method === "POST" && parsedURL.query.action.toUpperCase() === "POST" ) {

			} else if ( req.method === "DELETE" ) {
						
			} else { // Not a VALID request

				res.statusCode = 501;
				res.end( 'Q-IM API Server running: Invalid Method Used.');
			
			}
		}

	});

}


/**
 * @private
 * 
 * Handle all uncaught exceptions so that application does not exit
 * 
 */
process.on('uncaughtException', function(err) {
	console.log('Uncaught exception: ' + err);
	console.log(err.stack);
});