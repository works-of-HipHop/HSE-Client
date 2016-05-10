/*
 * Copyright (c) 2013 - 2016 @MaxVerified on behalf of 5ive Design Studio (Pty) Ltd. 
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
		fs 					= require("fs"),
		path 				= require('path'),
		nodeUtil 			= require("util"),			
		DBMine 				= require("./QDb"),
		PdfPrinter 			= require('./thirdparty/pdfmake'),
		Logger 				= require("./Logger"),
		Launcher 			= require("./Launcher"),
		xlsx 				= require("./thirdparty/xlsx"),
		mysql				= require('./thirdparty/mysql'),
		exec 				= require("child_process").exec,
		GetMac				= require("./thirdparty/getmac"),
		ConnectionManager 	= require("./ConnectionManager"),
		es 					= require('./thirdparty/event-stream'),
		mkdirp 				= require('./thirdparty/node-mkdirp'),
		//shell 				= require('./thirdparty/node-powershell'),
		xmlbuilder 			= require('./thirdparty/node-xml'),
		Service 			= require('./thirdparty/node-windows').Service,
		autoupdater 		= require('./thirdparty/auto-updater/auto-updater.js');

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
	var _mysqlServer = null,
		/** LIVE **/
		_SQL_host 		= '192.168.17.50',
		_SQL_port 		= 3306,
		_SQL_user 		= 'MyHSE',
		_SQL_pword 		= 'BXDFsHR',
		_SQL_dbname		= 'phse',
		/** /
    	_SQL_host 		= '197.189.253.71',
		_SQL_port 		= 3306,
		_SQL_user 		= 'fdstudio_phola',
		_SQL_pword 		= 'z^BN+Xh,Z3[S',
		_SQL_dbname		= 'fdstudio_hse_live',
		/**/
		_SQL_db_config 	= {
			//socketPath: address.port,
			host     			: _SQL_host,
			user     			: _SQL_user,
			password 			: _SQL_pword,
			database 			: _SQL_dbname,
			debug 				: true,
			multipleStatements 	: true,
			insecureAuth 		: true
			//stringifyObjects	: true
		};
	
	_mysqlServer = mysql.createConnection( _SQL_db_config );

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
	 * @param {type.<string>} filetype
	 * @param {printer.<string>} printer name
	 * @param {exe.<string>} path to program
	 * @param {path.<string>} path to load
	 * Print PDF FILE
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
	 * @param {path.<string>} path to load
     * Print PDF FILE
     */
	function cmdPrint( type, exe, path, callback ) {

		cmdDefaultPrinter( function(err, printer) {

			if( err ) {

				callback( err );
			
			} else {

				cmdOSArchitecture( function(error, arch) {

					if( error === false ) {

						if( arch == "64-bit" ) {

							var printerPath = "%PROGRAMFILES(x86)%/HSESPR~1/www/thirdparty/apps/SumatraPDFx64.exe";


						} else if( arch == "32-bit" ) {

							var printerPath = "%PROGRAMFILES%/HSESPR~1/www/thirdparty/apps/SumatraPDF.exe";

						} else {

							var printerPath = exe;

						};

						//callback(printerPath);

						/**/

						switch ( type ) {

							case 'pdf':

								//for adobe
								//var printIt = '"' + exe + '" /T "' + path + '" "' + printer + '"';
								var printIt = '"' + printerPath + '" -print-to-default "' + path + '"';

								break;

							case 'txt':

								//var printIt = '"' + exe + '" /N /T "' + path + '" "' + printer + '"';
								var printIt = 'print /d:"' + printer + '" "' + path + '"';

								break;

							case 'doc':


								//var printIt = '"' + exe + '" /q /n "' + path + '" "' + printer + '" /mFileExit';
								var printIt = 'print /d:"' + printer + '" "' + path + '"';

								break;

							case 'xls':

								//var printIt = '"' + exe + '" /q /n "' + path + '" "' + printer + '" /mFileExit';
								var printIt = 'print /d:"' + printer + '" "' + path + '"';

								break;

							case 'jpg':

								//var printIt = '"' + exe + '" /N /T "' + path + '" "' + printer + '"';
								//var printIt = 'print /d:"' + printer + '" "' + path + '"';

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

						});/**/

					} else {

						callback('Printer Path could not be initialised.  Please contact the Adminstrator.');

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
					
					// %PROGRAMFILES(x86)
					child = exec( "powershell.exe -noprofile -executionpolicy bypass c:\\program` files` `(x86`)\\HSE` Sprint` 33\\node-core\\credMan.ps1" + " -AddCred -Target '" + domain + "' -User '" + username + "' -Pass '" + password + "' -CredType 'DOMAIN_PASSWORD'" );
					
				} else if( arch == "32-bit" ) {

					//child = spawn( "powershell.exe", ["c:\\program files\\HSE Sprint 33\\node-core\\credMan.ps1 -AddCred", "pholacoalhse\\admin", "M1inopex" ] );
					//child = exec( "powershell.exe c:\\program` files\\HSE` Sprint` 33\\node-core\\credMan.ps1 -AddCred -Target " + domain + " -User " + username + " -Pass " + password );
					child = exec( "powershell.exe -noprofile -executionpolicy bypass c:\\program` files\\HSE` Sprint` 33\\node-core\\credMan.ps1 -AddCred -Target '" + domain + "' -User '" + username + "' -Pass '" + password + "' -CredType 'DOMAIN_PASSWORD'" );

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

	function cmdDomainLogout( path, username, callback ) {

		

	}

	function cmdSavePDF( path, fileName, dd, callback ) {
		
		cmdOSArchitecture( function(error, arch) {

			if( error === false ) {

				/**/
				if( arch == "64-bit" ) {

					var fonts = {
							Roboto: {
								"normal": 	 	'c:\\program files (x86)\\HSE Sprint 33\\node-core\\thirdparty\\fonts\\Roboto-Regular.ttf',
								"bold": 		'c:\\program files (x86)\\HSE Sprint 33\\node-core\\thirdparty\\fonts\\Roboto-Medium.ttf',
								"italics": 	 	'c:\\program files (x86)\\HSE Sprint 33\\node-core\\thirdparty\\fonts\\Roboto-Italic.ttf',
								"bolditalics": 	'c:\\program files (x86)\\HSE Sprint 33\\node-core\\thirdparty\\fonts\\Roboto-Italic.ttf'
							}
					};

				} else if( arch == "32-bit" ) {

					var fonts = {
							Roboto: {
								"normal": 	 	'c:\\program files\\HSE Sprint 33\\node-core\\thirdparty\\fonts\\Roboto-Regular.ttf',
								"bold": 		'c:\\program files\\HSE Sprint 33\\node-core\\thirdparty\\fonts\\Roboto-Medium.ttf',
								"italics": 	 	'c:\\program files\\HSE Sprint 33\\node-core\\thirdparty\\fonts\\Roboto-Italic.ttf',
								"bolditalics": 	'c:\\program files\\HSE Sprint 33\\node-core\\thirdparty\\fonts\\Roboto-Italic.ttf'
							}
					};

				} else {

					var fonts = {
							Roboto: {
								"normal": 	  	appDir +'fonts/Roboto-Regular.ttf',
								"bold": 	 	appDir +'fonts/Roboto-Medium.ttf',
								"italics": 	  	appDir +'fonts/Roboto-Italic.ttf',
								"bolditalics":  appDir +'fonts/Roboto-Italic.ttf'
							}
					};
					/** /
							fonts.Roboto = {
									"normal": './node-core/thirdparty/fonts/Roboto-Regular.ttf',
									"bold": './node-core/thirdparty/fonts/Roboto-Medium.ttf',
									"italics": './node-core/thirdparty/fonts/Roboto-Italic.ttf',
									"bolditalics": './node-core/thirdparty/fonts/Roboto-Italic.ttf'
					};/**/

				};
				
				var printer = new PdfPrinter( fonts );
				var pdfDoc = printer.createPdfKitDocument(dd);

				//var now = new Date();

				if ( !fs.existsSync(path) ){

					//EMAILING OPTION

					//fs.mkdirSync(path);

					mkdirp( path, function (err) {
						
						if (err) {

							callback(err);

						} else {

							pdfDoc.pipe( fs.createWriteStream( path + fileName ) );

							pdfDoc.end();

							callback( false, path + fileName );

						}

					});

				} else {

					pdfDoc.pipe( fs.createWriteStream( path + fileName ) );

					pdfDoc.end();

					callback( false, path + fileName );
				
				}

			}

		});
	
	}
	
	/**
     * @private
     * Kill Adobe Acrobat Process
     *
     * @param { String.name } [varname] [description] Acrord32.exe | Acrobat.exe
     * 
     */
	function cmdKillAdobe( adobeRdr, callback ) {

		var command = 'TaskKill /F /IM ' + adobeRdr;

		exec( command, function ( error, stdout, stderr ) {

			if( error ) {

		 		callback(error);
		 	}

		 	callback(false, 'Adobe Reader Closed');

		 	//return "success";

		});

		/** /

		_getProcessID ( 'Acrobat.exe', function( err, pid ) {

			if( err ) {

				return err;
			}

			var command = 'TaskKill /F /IM Acrobat.exe';

			 exec( command, function ( error, stdout, stderr ) {

			 	if( error ) {

			 		return error;
			 	}

			 });

		} );
		/**/

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

		cmdOSArchitecture( function(error, arch) {

			if( error === false ) {

				if( arch == "64-bit" ) {

					var mailerPath = "%PROGRAMFILES(x86)%/HSESPR~1/www/thirdparty/apps/SwithMail.exe";

					//child = exec( "powershell.exe -noprofile -executionpolicy bypass c:\\program` files` `(x86`)\\HSE` Sprint` 33\\node-core\\credMan.ps1" + " -AddCred -Target '" + domain + "' -User '" + username + "' -Pass '" + password + "' -CredType 'DOMAIN_PASSWORD'" );
					
				} else if( arch == "32-bit" ) {

					var mailerPath = "%PROGRAMFILES%/HSESPR~1/www/thirdparty/apps/SwithMail.exe";
					//child = exec( "powershell.exe -noprofile -executionpolicy bypass c:\\program` files\\HSE` Sprint` 33\\node-core\\credMan.ps1 -AddCred -Target '" + domain + "' -User '" + username + "' -Pass '" + password + "' -CredType 'DOMAIN_PASSWORD'" );

				} else {

					callback( 'Email sent not sent.  Unknown OS Archicture: ' + arch );

					return;

				};

				var mailMe  = '"' + mailerPath + '" /s /drnl false /name "' + data.FromName + '" /from "' + data.FromAddress + '" /pass "' + data.password + '" /obscurepassword "' + data.obscurepassword + '" /server "' + data.mailserver + '" /p "' + data.mailserverport + '" /ssl "' + data.ssl + '" /rr "' + data.requestreceipt + '" /to "' + data.toaddress + '" /cc "' + data.cc + '" /rt "' + data.replyto + '" /sub "' + data.subject + '" /body "' + data.body + '" /html "' + data.html + '" /a "' + data.attachment + '" /readreceipt "' + data.readreceipt + '"';

				var err = [],
					result = [];

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

				/** /
				child = exec( mailMe, function ( error, stdout, stderr ) {

					if ( error !== null ) {

						callback(error);

					} else {

						callback( false, stdout );

					}

				});/**/

			} else {

				callback( 'Email sent not sent.  OS Archicture Error: ' + error );

			};

		});

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
	function cmdCheckForUpdates( callback ) {

		//console.log( "[HSE-Node] checking for updates");

		/** /
		var autoupdater = require('./thirdparty/auto-updater/auto-updater.js')({
				pathToJson: '',
				async: true,
				silent: false,
				autoupdate: false,
				check_git: true
		});
		/** /
		autoupdater = {
			pathToJson: '',
			async: true,
			silent: false,
			autoupdate: false,
			check_git: true
		};/** /

		// State the events 
		autoupdater.on( 'git-clone', function() {
			console.log("You have a clone of the repository. Use 'git pull' to be up-to-date");
		});

		autoupdater.on( 'check-up-to-date', function(v) {
			console.log("You have the latest version: " + v);
		});

		autoupdater.on( 'check-out-dated', function(v_old , v) {
			console.log("Your version is outdated. "+v_old+ " of "+v);
			//autoupdater.forceDownloadUpdate(); // If autoupdate: false, you'll have to do this manually. 
			// Maybe ask if the'd like to download the update. 
		});

		autoupdater.on( 'update-downloaded', function() {
			console.log("Update downloaded and ready for install");
			//autoupdater.forceExtract(); // If autoupdate: false, you'll have to do this manually. 
		});

		autoupdater.on( 'update-not-installed', function() {
			console.log("The Update was already in your folder! It's read for install");
			//autoupdater.forceExtract(); // If autoupdate: false, you'll have to do this manually. 
		});

		autoupdater.on( 'extracted', function() {
			console.log("Update extracted successfully!");
			console.log("RESTART THE APP!");
		});

		autoupdater.on( 'download-start', function(name) {
			console.log("Starting downloading: " + name);
		});

		autoupdater.on( 'download-update', function(name,perc) {
			//process.stdout.write("Downloading " + perc + "% \033[0G");
		});

		autoupdater.on( 'download-end', function(name) {
			console.log("Downloaded " + name);
		});

		autoupdater.on( 'download-error', function(err) {
			console.log("Error when downloading: " + err);
		});

		autoupdater.on( 'end', function() {
			console.log("The app is ready to function");
		});

		// Start checking 
		autoupdater.forceCheck();
		/**/
	
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
	 * @public
	 * 
	 * @return
	 * 
	 * Return 
	 */
	function cmdSaveXlsx( path, data, callback ) {

		/** /
		jsonfile.writeFile( path, data, function (err) {
			
			callback( err, {
				'path': path
			});

		});
		/**/
	
	}

	/**
	 * @public
	 * 
	 * @return
	 * 
	 * Return 
	 */
	function cmdGetXlsx( path, callback ) {

		var workbook = xlsx.readFile( path );

		callback( false, {
			'path': workbook
		});

		/** /
		jsonfile.readFile( path, function(err, obj) {

			callback(err, obj);

		});/**/

	}

	/**
     * @private CRUD
     * @param {ws .<WebSocket>}
     * @param {credentials .<object>}
     * 
     * QUERY DB
     */
	function cmdQuery( ws, Qtype, db, callback  ) {

		//callback( false, Qtype );

		// ping test
		//_mysqlServer.ping( function (err) {
			
		//	if (err) {

				// reconnect & try again
			
		//		callback(err);
			
		//	} else {

		//_mysqlServer.connect();
		
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

		//_mysqlServer.end();

		//	}
		//});
	
	}

	/** /
	function mkdirSync ( path, callback ) {

		try {
		
			fs.mkdirSync(path);

			callback(false);
		
		} catch(e) {

			if ( e.code != 'EEXIST' ) {

				callback(e);

			};

		}
	
	}

	function mkdirpSync (dirpath) {
	
		var parts = dirpath.split(path.sep);
		
		for( var i = 1; i <= parts.length; i++ ) {
			mkdirSync( path.join.apply(null, parts.slice(0, i)) );
		}

	}
	/**/

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
			"base",       	// domain name
			"killAdobe",    // command name
			cmdKillAdobe,   // command handler function
			true,          // this command is synchronous
			"Handler for killing Adobe Acrobat Process",
			[
				{
					name: "adobeRdr",
					type: "String"
				}
			],
			[
            	{
            		name: "callback",
                	type: "function",
                	description: "stdout"
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
			false,											// this command is synchronous
			"Returns Mac Address of the current machine",
			[],             								// no parameters
			[]												// no return @params
		);
		_domainManager.registerCommand(
			"base", 										// domain name
			"GetXlsx",										// command name
			cmdGetXlsx,										// command handler function
			true,											// this command is asynchronous
			"Get Xlsx Data from file",
			[
				{
					name: "path", 
					type: "string"
				}
			],												// parameters
			[
				{
					name: "callback",
					type: "function"
				}
			]												//
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
