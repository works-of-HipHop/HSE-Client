/**
 * Configuration Manager
 *
 */
define( function (require, exports, module) {

	var Utilities = require("Utils");

	var Utils =  new Utilities.Utils();

	/*
	 * Defines application-wide key value pairs
	 * ------------------------------------------------*/
	var AppConstants,
		LStoKey 		= 'hse.preferences',
		defaultConfig 	= window.localStorage.getItem( LStoKey ),
		iniAppConfig 	= localStorage.getItem( 'appConfig' );

	AppConstants = {};

	function currentScriptPath() {

		var scripts = document.querySelectorAll( 'script[data-main]' );
		var currentScript = scripts[ scripts.length - 1 ].src;
		var currentScriptChunks = currentScript.split( '/' );
		var currentScriptFile = currentScriptChunks[ currentScriptChunks.length - 1 ];

		//console.log('init js file:', scripts);

		return currentScript.replace( currentScriptFile, '' );
	
	};

	var appDirectory = currentScriptPath();
	appDirectory = appDirectory.replace('file:///', '');

	console.log('HSE File Location: ', appDirectory );

	window.appDirectory = appDirectory;
		
	brackets.fs.readFile( brackets.app.getApplicationSupportDirectory() + '/config.json', 'utf8', function(err, data) {

			if( err ) {

				console.warn( 'loading AppData-config file failed:', err );

				brackets.fs.readFile( appDirectory + 'bootconfig/config.json', 'utf8', function(errr, data2) {

					if( errr ) {

						console.error( 'loading AppData-bootconfig file failed:', err, appDirectory + 'bootconfig/config.json' );

						/**/
						AppConstants = {

							"general": {
								"Appname"		: "HSE",
								"Version"		: "2",
								"api" 			: "",
								"installPath" 	: ""		
							},
							"directory": {
								"root"			: [],
								"level"			: 1,
								"page_size"		: 3,
								"maxVisible"	: 1,
								"type"	 		: "cover",		// overlap || cover
								"levelSpacing"	: 40, 			// space between each overlaped level
								"backClass"	 	: "mp-back"		// classname for the element (if any) that when clicked closes the current level
							},
							"configuration": {
								"Default_lang"		: "eng",
								"Date_Format" 		: "d-m-y",
								"Allowed_Files"		: [ "png", "jpg", "gif", "pdf", "docx", "doc" ],
								"Sort_Method"		: "date-",
								"Number_of_Columns"	: 3,
								"templatePath"		: "htmlContent",
								"autoRefresh"		: true,
								"global"			: false
							},
							"printing": {
								"pdfReaderPath"		: "",
								"pdfReaderName"		: "",
								"pdfReaderTimeout"	: 6000,
								"docPath"			: "",
								"xlsPath"			: "",
								"txtPath"			: "",
								"pictureViewerPath"	: "",
								"pdfPrinter"		: "",
								"defaultPrinter"	: ""
							},
							"FileTypes":			[
								{
									"extension"			: "PDF",
									"visibility"		: true,
									"print"				: false,
									"preview"			: true,
									"app_path"			: ""
								},
								{
									"extension"			: "TEXT",
									"visibility"		: false,
									"print"				: false,
									"preview"			: true,
									"app_path"			: ""
								},
								{
									"extension"			: "IMAGES",
									"visibility"		: false,
									"print"				: false,
									"preview"			: true,
									"app_path"			: ""
								}
							],
							"paths": {
								"appFolders"		:	{
									"hse"			:	{
											"ID"			: 1,
											"Name"			: "HSE Install Directory",
											"Path"			: "",
											"LastUpdated"	: ""
									},
									"pdf"			:	{
											"ID"			: 2,
											"Name"			: "PDF Reader",
											"Path"			: "",
											"LastUpdated"	: ""
									},
									"doc"			:	{
											"ID"			: 2,
											"Name"			: ".Doc File Reader",
											"Path"			: "",
											"LastUpdated"	: ""
									},
									"xls"			:	{
											"ID"			: 2,
											"Name"			: ".Xls File Reader",
											"Path"			: "",
											"LastUpdated"	: ""
									}
								},
								"networkFolders"	:	[
									{
										"ID"			: 0,
										"Name"			: "HSE Root Network Directory",
										"Path"			: "",
										"isHome"		: true,
										"network"		: [],
										"LastUpdated"	: ""
									}
								],
								"branchFolders"	:	[]
							},
							"information_categories"	: [
										{
											"ID"			: 0,
											"Name"			: "Change Management",
											"Path"			: "",
											"LastUpdated"	: ""
										},
										{
											"ID"			: 1,
											"Name"			: "Management Briefs",
											"Path"			: "",
											"LastUpdated"	: ""
										},
										{
											"ID"			: 2,
											"Name"			: "News Flashes",
											"Path"			: "",
											"LastUpdated"	: ""
										},
										{
											"ID"			: 3,
											"Name"			: "Planned Task Observation",
											"Path"			: "",
											"LastUpdated"	: ""
										},
										{
											"ID"			: 4,
											"Name"			: "Policies",
											"Path"			: "",
											"LastUpdated"	: ""
										},
										{
											"ID"			: 5,
											"Name"			: "Pre-use Inspection Checklists",
											"Path"			: "",
											"LastUpdated"	: ""
										},
										{
											"ID"			: 6,
											"Name"			: "Procedures",
											"Path"			: "",
											"LastUpdated"	: ""
										},
										{
											"ID"			: 7,
											"Name"			: "Risk Assessments",
											"Path"			: "",
											"LastUpdated"	: ""
										},
										{
											"ID"			: 8,
											"Name"			: "Toolbox Talks",
											"Path"			: "",
											"LastUpdated"	: ""
										},
										{
											"ID"			: 9,
											"Name"			: "Material Safety Data Sheets (MSDS)",
											"Path"			: "",
											"LastUpdated"	: ""
										},
										{
											"ID"			: 10,
											"Name"			: "Environmental Documents",
											"Path"			: "",
											"LastUpdated"	: ""
										}
							],
							"admin_credentials"			: {
								"username"	: "m1n0p3x",
								"password"	: "258369"
							}

						};/**/

					} else {

						console.info('App\'s Default Data :)');

						AppConstants = JSON.parse(data2);

					}

					brackets.fs.writeFile( brackets.app.getApplicationSupportDirectory() + '/config.json', JSON.stringify(AppConstants), 'utf8', function(err) {

						switch( err ) {

								case 'NO_ERROR':

									//callback( false, 'File Saved Successfully at ' + filePath );
									console.log('Configuration File Saved Successfully.' );

									break;

								case 'ERR_UNKNOWN':
								case 'ERR_CANT_WRITE':
								case 'ERR_OUT_OF_SPACE':
								case 'ERR_INVALID_PARAMS':
								case 'ERR_UNSUPPORTED_ENCODING':

									console.error('error saving configuration file:', err);

									noti5y.log('error', 'An Error occurred with the Configuration File.  Please contact the Administrator.');

									break;
											
								default:

									//callback( false, 'File Saved Successfully at ' + filePath );

									console.log('Configuration File Saved Successfully.' );
														
									break;
												
						}

					});

					// Public API
					exports.AppConstants	= AppConstants;

				});

			} else {

				console.warn( 'bootConfig', JSON.parse(data) );

				AppConstants = JSON.parse(data);

				// Public API
				exports.AppConstants	= AppConstants;

			}
	
	});

});