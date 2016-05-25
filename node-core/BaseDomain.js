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

	var os 					= require("os"),
		path 				= require('path'),
		nodeUtil 			= require("util"),			
		DBMine 				= require("./QDb"),
		Logger 				= require("./Logger"),
		Launcher 			= require("./Launcher"),

		//xlsx 				= require("./thirdparty/xlsx"),
		mysql				= require('./thirdparty/mysql'),
		exec 				= require("child_process").exec,
		GetMac				= require("./thirdparty/getmac"),
		ConnectionManager 	= require("./ConnectionManager"),
		PdfPrinter 			= require('./thirdparty/pdfmake'),
		request 			= require('./thirdparty/request'),
		fs 					= require("./thirdparty/fs-extra"),
		mkdirp 				= require('./thirdparty/node-mkdirp'),
		Service 			= require('./thirdparty/node-windows').Service,
		EventLogger 		= require('./thirdparty/node-windows').EventLogger;

	var Q5log 	= new EventLogger('Q-Not5y');
	var svc 	= new Service({
		name:'Q-Not5y',
		description: 'The Q-5 Server for HSE notifications and updates.',
		script: path.join( __dirname, 'auto-update/service.js'),
		env: [{
				name: "HOME",
				value: process.env["USERPROFILE"] // service is now able to access the user who created its' home directory
			},
			{
				name: "TEMP",
				value: path.join( process.env["USERPROFILE"],"/temp" ) // use a temp directory in user's home directory
			},
			{
				name: "HSEEXE",
				value: path.join( __dirname, '../', 'HSE-Client.exe' ) // use a temp directory in user's home directory
			}
		],
		wait: 2,
		grow: .5
	});

    /**
     * @private
     * @type {DomainManager}
     * DomainManager provided at initialization time
     */
	var _domainManager = null;

  	/**
     * @private
     * @type MySQL Server
     */
    var _mysqlServer 	= null,
    	_SQL_db_config 	= {};

	try {

		var DBconfigObj = fs.readJsonSync( path.join( __dirname, '../', "config.json" ) );

		svc.user.domain 	= os.hostname();
		svc.user.account 	= DBconfigObj.development.sudoUser;
		svc.user.password 	= DBconfigObj.development.sudoPwd;

		_SQL_db_config 	= {
			//socketPath 		: address.port,
			host     			: DBconfigObj.development.host,
			user     			: DBconfigObj.development.user,
			password 			: DBconfigObj.development.password,
			database 			: DBconfigObj.development.database,
			debug 				: false,
			multipleStatements 	: true,
			insecureAuth 		: true
			//stringifyObjects	: true
		};

		_mysqlServer = mysql.createPool( _SQL_db_config );

	} catch (e) {

		console.log('config.json error:', e);

	}

    /**
     * @private
     * Handler function for the simple.getMemory command.
     * @return {{total: number, free: number}} The total and free amount of
     *   memory on the user's system, in bytes.
     */
	function cmdGetMemory() {

		//log.info('Memory Request by ' + os.hostname() );

		return {
			total: os.totalmem(), 
			free: os.freemem()
		};

	}
    
    /**
     * @private
     * Implementation of base.enableDebugger commnad.
     * In the future, process._debugProcess may go away. In that case
     * we will probably have to implement re-launching of the Node process
     * with the --debug command line switch.
     */
	function cmdEnableDebugger() {
		// Unfortunately, there's no indication of whether this succeeded
		// This is the case for _all_ of the methods for enabling the debugger.
		process._debugProcess(process.pid);

	}
    
    /**
     * @private
     * Implementation of base.restartNode command.
     */
	function cmdRestartNode() {
	
		Launcher.exit();

	}
    
    /**
     * @private
     * Implementation of base.loadDomainModulesFromPaths
     * @param {Array.<string>} paths Paths to load
     * @return {boolean} Whether the load succeeded
     */
	function cmdLoadDomainModulesFromPaths( paths ) {

		if ( _domainManager ) {
			var success = _domainManager.loadDomainModulesFromPaths( paths );
			if ( success ) {
				_domainManager.emitEvent( "base", "newDomains" );
			}
			return success;
		} else {
			return false;
		}
    
	}

    /**
     * @private
     * Traverse File System Recursively
     * @param {currentPath.<string>} path to load
     * @return {object}
     */
    function cmdTraverseFileSystem ( currentPath ) {

		var tree = {},
			fldrz = [],
			flz = [];
		
		var files = fs.readdirSync(currentPath);
		var j = 0;

		for (var i in files) {

			var currentFile = currentPath + '/' + files[i];
			var stats = fs.statSync(currentFile);

			//console.log(currentFile);
			
			if (stats.isFile()) {
				
				//console.log(currentFile);

				flz[j] = currentFile;
			
			} else if (stats.isDirectory()) {

				fldrz[j] = currentFile;
			
				//cmdTraverseFileSystem( currentFile );
			}

			//callback( currentFile )

			//flz[j] = currentFile;

			j++;
		}

		/**/
		return tree = {
			'folders': fldrz,
			'files': flz
		}
		/**/
	
	}

	/**
	 * @private
	 * GET OS ARCHITECTURE
	 */
	function cmdOSArchitecture( callback ) {

		var child = exec( "wmic os get osarchitecture", function ( error, stdout, stderr ) {

			if ( error !== null ) {

				callback(error);

			} else {

				var response =  stdout.split(os.EOL);

				//taskDetails[3].split('The default printer is')[1] str.replace( /(^\s+|\s+$)/g, '' )

				callback( false, response[1].replace( /(^\s+|\s+$)/g, '' ) );

			}

		});

	}

	/**
     * @private
     * @param {type.<string>} filetype
     * @param {printer.<string>} printer name
     * @param {exe.<string>} path to program
	 * @param {spath.<string>} path to load
     * Print PDF FILE
     */
	function cmdPrint( type, exe, spath, callback ) {

		cmdDefaultPrinter( function(err, printer) {

			if( err ) {

				callback( err );
			
			} else {

				var printerPath = path.join( __dirname, '../', 'www/thirdparty/apps/SumatraPDF.exe');

				switch ( type ) {

					case 'pdf':

						//for adobe
						//var printIt = '"' + exe + '" /T "' + spath + '" "' + printer + '"';
						var printIt = '"' + printerPath + '" -print-to-default "' + spath + '"';

						break;

					case 'txt':

						//var printIt = '"' + exe + '" /N /T "' + spath + '" "' + printer + '"';
						var printIt = 'print /d:"' + printer + '" "' + spath + '"';

						break;

					case 'doc':

						//var printIt = '"' + exe + '" /q /n "' + spath + '" "' + printer + '" /mFileExit';
						var printIt = 'print /d:"' + printer + '" "' + spath + '"';

						break;

					case 'xls':

						//var printIt = '"' + exe + '" /q /n "' + spath + '" "' + printer + '" /mFileExit';
						var printIt = 'print /d:"' + printer + '" "' + spath + '"';

						break;

					case 'jpg':

						//var printIt = '"' + exe + '" /N /T "' + spath + '" "' + printer + '"';
						//var printIt = 'print /d:"' + printer + '" "' + spath + '"';

						break;

					default:

						break;

				};
						
				var child = exec( printIt, function ( error, stdout, stderr ) {

					if ( error !== null ) {

						callback(error);

					} else {

						callback( false, stdout );

					}

				});

			};

		});

	}

	function cmdDomainLogin( domain, username, password, callback ) {

		var child,
			spawn = require("child_process").spawn;

		cmdOSArchitecture( function(error, arch) {

			if( error === false ) {

				if( arch == "64-bit" ) {
					
					child = exec( "powershell.exe -noprofile -executionpolicy bypass c:\\program` files` `(x86`)\\HSE-Client\\node-core\\credMan.ps1" + " -AddCred -Target '" + domain + "' -User '" + username + "' -Pass '" + password + "' -CredType 'DOMAIN_PASSWORD'" );
					
				} else if( arch == "32-bit" ) {

					child = exec( "powershell.exe -noprofile -executionpolicy bypass c:\\program` files\\HSE-Client\\node-core\\credMan.ps1 -AddCred -Target '" + domain + "' -User '" + username + "' -Pass '" + password + "' -CredType 'DOMAIN_PASSWORD'" );

				};

				var err = [],
					result = [];

				child.stdout.on( "data", function(data) {
				
					//console.log( "Powershell Data: " + data);

					result.push(data);
				
				});
				
				child.stderr.on( "data", function(data) {
				
					//console.log( "Powershell Errors: " + data );

					err.push(data);
				
				});
				
				child.on( "exit", function(){

					//console.log("Powershell Script finished");

					if( err.length > 0 ) {

						callback(err);

					} else {

						callback(false, result);

					};
				
				});

				child.stdin.end(); //end input

			} else {

				callback(error);

			};

		});

	}

	function cmdDomainLogout( path, username, callback ) {}

	function cmdSavePDF( spath, fileName, dd, callback ) {

		var fonts = {
				Roboto: {
					"normal": 	 	path.join( __dirname, 'thirdparty/fonts/Roboto-Regular.ttf'),
					"bold": 		path.join( __dirname, 'thirdparty/fonts/Roboto-Medium.ttf'),	//'c:\\program files (x86)\\HSE Sprint 33\\node-core\\thirdparty\\fonts\\Roboto-Medium.ttf',
					"italics": 	 	path.join( __dirname, 'thirdparty/fonts/Roboto-Italic.ttf'),	//'c:\\program files (x86)\\HSE Sprint 33\\node-core\\thirdparty\\fonts\\Roboto-Italic.ttf',
					"bolditalics": 	path.join( __dirname, 'thirdparty/fonts/Roboto-Italic.ttf')	//'c:\\program files (x86)\\HSE Sprint 33\\node-core\\thirdparty\\fonts\\Roboto-Italic.ttf'
				}
		
		};

		var printer = new PdfPrinter( fonts );
		var pdfDoc = printer.createPdfKitDocument(dd);

		//var now = new Date();

		if ( !fs.existsSync(spath) ){

			//EMAILING OPTION

			//fs.mkdirSync(spath);

			mkdirp( spath, function (err) {
						
				if (err) {

					callback(err);

				} else {

					pdfDoc.pipe( fs.createWriteStream( spath + fileName ) );

					pdfDoc.end();

					callback( false, spath + fileName );

				}

			});

		} else {

			pdfDoc.pipe( fs.createWriteStream( spath + fileName ) );

			pdfDoc.end();

			callback( false, spath + fileName );
				
		}

	}
	
	/**
	 * @private
	 * 
	 *
	 * @param { Object.data } [data] [description]
	 * @param { message.String } [String] [description]
	 * @param { Function.callback } [callback] [description]
	 * 
	 */
	function cmdEmail( data, callback ) {

		var child;
		var mailerPath = path.join( __dirname, '../', 'www/thirdparty/apps/SwithMail.exe');

		var mailMe  = '"' + mailerPath + '" /s /drnl false /name "' + data.FromName + '" /from "' + data.FromAddress + '" /pass "' + data.password + '" /obscurepassword "' + data.obscurepassword + '" /server "' + data.mailserver + '" /p "' + data.mailserverport + '" /ssl "' + data.ssl + '" /rr "' + data.requestreceipt + '" /to "' + data.toaddress + '" /cc "' + data.cc + '" /rt "' + data.replyto + '" /sub "' + data.subject + '" /body "' + data.body + '" /html "' + data.html + '" /a "' + data.attachment + '" /readreceipt "' + data.readreceipt + '"';

		var err 	= [],
			result 	= [];

		/**/
		child = exec( mailMe );

		child.stdout.on( "data", function(data) {

			result.push(data);
				
		});
				
		child.stderr.on( "data", function(data) {

			err.push(data);
				
		});
				
		child.on( "exit", function(){

			//console.log("Powershell Script finished");

			if( err.length > 0 ) {

				callback(err);

			} else {

				callback(false, result);

			};
				
		});

		child.stdin.end(); //end input

	}

	/**
	 * @private
	 * 
	 *
	 * @param { Object.data } [data] [description]
	 * @param { message.String } [String] [description]
	 * @param { Function.callback } [callback] [description]
	 * 
	 */
	function cmdWriteLog( path, fileName, data, callback ) {


		data.machine = os.hostname();

		if ( !fs.existsSync(path) ){

			fs.mkdirSync(path);

			fs.writeFile( path + '/' + fileName, data, function(err) {

				if(err) {
					callback(err);
				
				} else {

					callback(false, 'Log File [' + path + '/' + fileName + '] saved.')
				}
			
			});

		} else {

			fs.appendFile( path + '/' + fileName, data + os.EOL, function(err){
				
				if( err ) {
					callback(err);
				
				} else {

					callback(false, 'Log data [' + path + '/' + fileName + '] saved.')
				}
			
			});

		}
	
	}

	/**
	 * @private
	 * 
	 *
	 * @param { Object.data } [data] [description]
	 * @param { message.String } [String] [description]
	 * @param { Function.callback } [callback] [description]
	 * 
	 */
	function cmdReadLog( fileName, data, callback ) {}

	/**
	 * @private
	 * 
	 * @return {MacAddress .<String>}
	 * 
	 * Return Mac Address of the current machine
	 */
	function cmdGetMacAddress( callback ) {

		GetMac.getMac( function( err, macAddress ) {

			callback( err, macAddress);

		});/**/
	
	}

	/**
	 * @private
	 * 
	 * @return {MacAddress .<String>}
	 * 
	 * Return Mac Address of the current machine
	 */
	function cmdCheckForUpdates( updateUrl, currentVersion, callback ) {

		//console.log( "[HSE-Node] checking for updates");		

		request({
				encoding 	: null,
				url 		: updateUrl
			})
			.pipe( fs.createWriteStream( path.join( __dirname, '../', 'hse-update.zip') ) )
			.on( 'error', function(err) {

				callback(err)

			})
			.on( 'close', function () {

			   callback( false, 'Update Downloaded for ' + currentVersion);
			
			});

	}

	/**
	 * @private
	 * 
	 * @return 
	 * 
	 * Return
	 */
	function cmdNot5yStart( callback ) {

		svc.on( 'start',function(){

			//Q5log.info('Q-Not5y Started.');

			callback( false, 'Updates Installing.  Please be patient.');
			
		});

		svc.on( 'install',function(){

			//Q5log.info('Q-Not5y Installed.');

			svc.start();
			
		});

		svc.on( 'invalidinstallation',function(){

			callback('Not5y could not be installed.');
			
		});

		svc.on( 'uninstall',function(){

			callback( false, 'Not5y Service Removed successfully.');
		
		});

		svc.on( 'error',function(){

			callback( 'Not5y Error.');
		
		});

		//svc.install();
		/**/
		if( svc.exists ) {

			svc.start();
			//svc.uninstall();
		
		} else {

			svc.install();

			//callback('Not5y Service Not Installed');
		
		}/**/
	
	}

	/**
	 * @private
	 * 
	 * @return 
	 * 
	 * Return
	 */
	function cmdNot5yStop( callback ) {

		svc.on( 'stop ',function(){

			svc.uninstall();
			
		});

		svc.on( 'uninstall',function(){

			callback( false, 'Not5y Service Stopped & Removed successfully.');
		
		});

		svc.on( 'error',function(){

			callback( 'Not5y Error.');
		
		});

		if( svc.exists ) {

			svc.stop();			
		
		} else {

			callback('Not5y Service Not Installed');
		
		}
	
	}

	/**
	 * @private
	 * 
	 * @return 
	 * 
	 * Return
	 */
	function cmdNot5yInstall( callback ) {

		svc.on( 'install',function(){

			svc.start();
			
		});

		svc.on( 'start',function(){

			callback( false, 'Updates Installing.  Please be patient.');
			
		});

		if( svc.exists ) {

			svc.start();
		
		} else {

			svc.install();
		
		}

	}

	/**
	 * @private
	 * 
	 * @return 
	 * 
	 * Return
	 */
	function cmdNot5yUninstall( callback ) {

		svc.on( 'uninstall',function(){

			callback( false, 'Not5y Service Removed successfully.');
		
		});

		if( svc.exists ) {

			svc.uninstall();
		
		} else {

			callback('Not5y Service Not Installed');
		
		}

	}

	/**
	 * RETURN DEFAULT PRINTER
	 * 
	 * Image Name 	PID 	Session Name 	Session# 	Mem Usage
	 * ==========	===		============	========	=========
	 * 
	 * FI - Find in (Header/Column)
	 * NH - No Header in results
	 *
	 * @param {Function.callback}
	 * 
	 **/
	function cmdDefaultPrinter( callback ) {

		exec( 'cscript c:\\windows\\system32\\Printing_Admin_Scripts\\en-us\\prnmngr.vbs -g', function( err, stdout, stderr ) {

			if( err ) {

				//console.log(err);

				callback(err);
	
			}

			var taskDetails =  stdout.split(os.EOL); //stdout;//stdout.match(/\S+/g);

			//console.log(stdout);
			//console.log(taskDetails);
			//console.log( taskDetails[0] + ' processID: ' , taskDetails[1] );

			callback( false, taskDetails[3].split('The default printer is')[1] );

			//taskDetails = null;

		});

	}

	/**
	 * RETURN PROCESS ID
	 * 
	 * Image Name 	PID 	Session Name 	Session# 	Mem Usage
	 * ==========	===		============	========	=========
	 * 
	 * FI - Find in (Header/Column)
	 * NH - No Header in results
	 *
	 * @param {String.process_name} //Acrord32.exe //Acrobat.exe
	 * @param {Function.callback}
	 * 
	 **/
	function _getProcessID( processName, callback ) {

		exec( 'tasklist /NH /FI "IMAGENAME eq ' + processName + '"', function( err, stdout, stderr ) {

				if( err ) {

					//console.log(err);

					callback(err);
				}

				/**
				 * @private
				 * 
				 * taskDetails {Array}
				 * 
				 * @key {0: Image Name}
				 * @key {1: PID}
				 * @key {2: Session Name}
				 * @key {3: Session#}
				 * @key {4: Mem Usage}
				 *
				 **/

				var taskDetails =  stdout.match(/\S+/g);

				//console.log(stdout);
				//console.log(taskDetails);
				//console.log( taskDetails[0] + ' processID: ' , taskDetails[1] );

				callback( false, taskDetails[1] );

				taskDetails = null;

		});
	
	}

	/**
     * @private CRUD
     * @param {ws .<WebSocket>}
     * @param {credentials .<object>}
     * 
     * QUERY DB
     */
	function cmdQuery( ws, Qtype, db, callback  ) {
		
		switch( Qtype ) {

			case 'authenticate': 

					DBMine.DBAuthenticate( _mysqlServer, db, function(error, msg) {

						callback( error, msg );
						
					});

					break;

			case 'create':

					DBMine.DBCreateData( _mysqlServer, db, function(error, msg) {
				
						callback( error, msg );

					});

					break;

			case 'get':

					DBMine.DBGetData( _mysqlServer, db, function(error, msg) {
				
						callback( error, msg );

					});

					break;

			case 'update':

					DBMine.DBUpdateData( _mysqlServer, db, function(error, msg) {
				
						callback( error, msg );

					});

					break;

			case 'delete':

					DBMine.DBDeleteData( _mysqlServer, db, function(error, msg) {
				
						callback( error, msg );

					});

					break;

		};
	
	}

    /**
     *
     * Registers commands with the DomainManager
     * @param {DomainManager} domainManager The DomainManager to use
     */
    function init( domainManager ) {

        _domainManager = domainManager;
        
        _domainManager.registerDomain( "base", {major: 0, minor: 1} );
        
        /*
		 *	:: COMMANDS
		 * ----------------------------------------------------*/
		
		// Not5y
		_domainManager.registerCommand(
			"base",						// domain name
			"not5yStart",				// command name
			cmdNot5yStart,				// command handler function
			true,						// this command is synchronous
			"Start Not5y",
			[],
			[
				{
					name: "result",
					type: "function",
					description: "Initiate Not5y Application Service"
				}
			]
		);
		_domainManager.registerCommand(
			"base",						// domain name
			"not5yStop",				// command name
			cmdNot5yStop,				// command handler function
			true,						// this command is synchronous
			"Stop Not5y",
			[],
			[
				{
					name: "result",
					type: "function",
					description: "Stop Not5y Application Service"
				}
			]
		);
		_domainManager.registerCommand(
			"base",						// domain name
			"not5yInstall",				// command name
			cmdNot5yInstall,				// command handler function
			true,						// this command is synchronous
			"Stop Not5y",
			[],
			[
				{
					name: "result",
					type: "function",
					description: "Install Not5y Application Service"
				}
			]
		);
		_domainManager.registerCommand(
			"base",						// domain name
			"not5yUninstall",				// command name
			cmdNot5yUninstall,				// command handler function
			true,						// this command is synchronous
			"Stop Not5y",
			[],
			[
				{
					name: "result",
					type: "function",
					description: "Install Not5y Application Service"
				}
			]
		);

		//

		_domainManager.registerCommand(
			"base",			// domain name
			"getMemory",	// command name
			cmdGetMemory,	// command handler function
			false,			// this command is synchronous
			"Returns the total and free memory on the user's system in bytes",
			[],				// no parameters
			[
				{
					name: "memory",
					type: "{total: number, free: number}",
					description: "amount of total and free memory in bytes"
				}
			]
		);
		_domainManager.registerCommand(
			"base",       	// domain name
			"print",    // command name
			cmdPrint,   // command handler function
			true,          // this command is synchronous
			"Print Document",
			[	
				{
					name: "type",
					type: "String"
				},
				{
					name: "exe",
					type: "String"
				},
				{
					name: "path",
					type: "String"
				}
			],
			[
            	{
            		name: "result",
                	type: "function",
                	description: "print result message"
                }
			]
		);
		_domainManager.registerCommand(
			"base",       	// domain name
			"savePDF",    // command name
			cmdSavePDF,   // command handler function
			true,          // this command is synchronous
			"Save PDF Document",
			[	
				{
					name: "path",
					type: "String"
				},
				{
					name: "fileName",
					type: "String"
				},
				{
					name: "documentDefinition",
					type: "String"
				}
			],
			[
				{
					name: "result",
					type: "function",
					description: "save pdf to filesystem"
				}
			]
		);
		_domainManager.registerCommand(
			"base",						// domain name
			"domainLogin",				// command name
			cmdDomainLogin,				// command handler function
			true,						// this command is synchronous
			"log into required doamin",
			[	
				{
					name: "domain",
					type: "String"
				},
				{
					name: "username",
					type: "String"
				},
				{
					name: "password",
					type: "String"
				}
			],
			[
				{
					name: "result",
					type: "function",
					description: "Log into requested domain"
				}
			]
		);
		_domainManager.registerCommand(
			"base",						// domain name
			"domainLogout",				// command name
			cmdDomainLogout,				// command handler function
			true,						// this command is synchronous
			"log out of required doamin",
			[	
				{
					name: "path",
					type: "String"
				},
				{
					name: "username",
					type: "String"
				}
			],
			[
				{
					name: "result",
					type: "function",
					description: "Log oout of requested domain"
				}
			]
		);
		_domainManager.registerCommand(
			"base", 									// domain name
			"sendEmail",								// command name
			cmdEmail,									// command handler function
			true,										// this command is asynchronous
			"Send Email",
			[
				{
					name: "data",
					type: "object",
					description: "Email config data"
				}
			],             								// no parameters
			[
				{
					name: "callback",
					type: "function",
					description: "Email Sent Status"
				}
			]
		);
		_domainManager.registerCommand(
			"base", 										// domain name
			"getMacAddress",								// command name
			cmdGetMacAddress,								// command handler function
			true,											// this command is asynchronous
			"Returns Mac Address of the current machine",
			[],             								// no parameters
			[
				{
					name: "callback",
					type: "function",
					description: "Mac Address of the current machine"
				}
			]
		);
		_domainManager.registerCommand(
			"base",												// domain name
			"getDefaultPrinter",								// command name
			cmdDefaultPrinter,									// command handler function
			true,												// this command is asynchronous
			"Returns default printer of the current machine",
			[],             									// no parameters
			[
				{
					name: "callback",
					type: "function",
					description: "Default Printer of the current machine"
				}
			]
		);
		_domainManager.registerCommand(
			"base", 										// domain name
			"CheckForUpdates",								// command name
			cmdCheckForUpdates,								// command handler function
			true,											// this command is synchronous
			"Returns updates",
			[
				{
					name: "updateUrl", 
					type: "string"
				},
				{
					name: "currentVersion", 
					type: "string"
				}
			],             								// no parameters
			[]												// no return @params
		);
		_domainManager.registerCommand(
			"base", 									// domain name
			"WriteLog",								// command name
			cmdWriteLog,									// command handler function
			true,										// this command is asynchronous
			"Write to Log File",
			[
				{
					name: "path",
					type: "string",
					description: "Directory of Log file"
				},
				{
					name: "fileName",
					type: "string",
					description: "file name of log file"
				},
				{
					name: "data",
					type: "string",
					description: "data to be written"
				}
			],             								// no parameters
			[
				{
					name: "callback",
					type: "function",
					description: "log write Status"
				}
			]
		);
		_domainManager.registerCommand(
			"base",       	// domain name
			"sqlQ",    // command name
			cmdQuery,   // command handler function
			true,          // this command is synchronous
			"Query Database",
			[	
				{
					name: "ws",
					type: "WebSocket"
				},
				{
					name: "Qtype",
					type: "String"
				},
				{
					name: "parameters",
					type: "Object"
				}
			],
			[
            	{
            		name: "callback",
                	type: "function",
                	description: "query results"
                }
			]
		);
		_domainManager.registerCommand(
			"base",
			"enableDebugger",
			cmdEnableDebugger,
			false,
			"Attempt to enable the debugger",
			[], // no parameters
			[]  // no return type
		);
        _domainManager.registerCommand(
			"base",
			"restartNode",
			cmdRestartNode,
			false,
			"Attempt to restart the Node server",
			[], // no parameters
			[]  // no return type
		);
        _domainManager.registerCommand(
            "base",
            "loadDomainModulesFromPaths",
            cmdLoadDomainModulesFromPaths,
            false,
            "Attempt to load command modules from the given paths. " + "The paths should be absolute.",
            [{name: "paths", type: "array<string>"}],
            [{name: "success", type: "boolean"}]
        );

		/*
		 *	:: EVENTS
		 * ----------------------------------------------------*/
		_domainManager.registerEvent( "base", "newDomains", [] );
		_domainManager.registerEvent(
			"base",
			"log",
			[
				{ name: "level", 		type: "string" },
				{ name: "timestamp", 	type: "Date" },
				{ name: "message", 		type: "string" }
			]
		);
		/** /
		_domainManager.registerEvent(
			"base",
			"DBQuery",
			[
				{ name: "timestamp", 	type: "Date" },
				{ name: "message", 		type: "object" }
			]
		);/**/


		/*
		 *	:: ACTIONS ( EVENT LISTENERS )
		 * ----------------------------------------------------*/
        Logger.on( "log", function ( level, timestamp, message ) {
			_domainManager.emitEvent(
				"base",
				"log",
				[level, timestamp, message]
			);
		});
        
    }
    
    exports.init = init;
    
}());
