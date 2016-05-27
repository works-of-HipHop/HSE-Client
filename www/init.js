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
require.config({
	paths: {
		//"app": 						'production/app-min',
		"app": 						'app',
		"AppConstants": 			'base-config/config',
		"md5hash": 					'utils/md5hash',
		"nodeConnection":       	'utils/NodeConnection',
		"text": 					'thirdparty/text/text',
		"i18n": 					'thirdparty/i18n/i18n',
		'CommandHandlers': 			'command/CommandHandlers',
		'HelpCommandHandlers': 		'command/HelpCommandHandlers',
		"window":       			'utils/window',
		"document":     			'utils/document',
		"pathUtils":				'thirdparty/path-utils/path-utils.min',
		'localforage': 				'thirdparty/localforage.min',
		"Utils": 					'thirdparty/Utils',
		//angular
		//"angular": 					'thirdparty/angular.1.2',
		"angular": 					'thirdparty/angular.1.2.1.min',
		"angular-animate": 			'thirdparty/plugins/angular/angular-animate.min',
		"angular-route": 			'thirdparty/plugins/angular/angular-route.min',
		"angular-filter": 			'thirdparty/plugins/angular/angular-filter.min',
		"angular-touch": 			'thirdparty/plugins/angular/angular-touch.min',
		"angular-gestures": 		'thirdparty/plugins/angular/gestures.min',
		"angular-tour-html":		'thirdparty/plugins/angular/angular-tour-tpls.min',
		"angular-dialog": 			'thirdparty/plugins/angular/ngDialog.min',
		"angular-accordion":		'thirdparty/plugins/angular/ang-accordion',
		"autocomplete": 			'thirdparty/plugins/angular/angucomplete-alt',
		"angular-progress": 		'thirdparty/plugins/angular/ngProgress.min',
		"angular-batch-http": 		'thirdparty/plugins/angular/angular-http-batch.min',
		"bindonce": 				'thirdparty/plugins/angular/bindonce.min',
		"angular-pagination": 		'thirdparty/plugins/angular/angular-utils-pagination/dirPagination',
		"angular-file-upload": 			'thirdparty/plugins/angular/file-upload/angular-file-upload.min',
		"angular-file-upload-shim": 	'thirdparty/plugins/angular/file-upload/angular-file-upload-html5-shim.min',
		"angular-file-upload-fileAPI": 	'thirdparty/plugins/angular/file-upload/FileAPI.min',
		//3rdParty
		"modernizr": 				'thirdparty/modernizr',
		"sjcl": 					'thirdparty/sjcl',
		"secStore": 				'thirdparty/secStore.min',
		"later": 					'thirdparty/later.min',
		"domReady": 				'thirdparty/domready',
		"classie": 					'thirdparty/classie',
		"humane": 					'thirdparty/humane.min',
		"operative": 				'thirdparty/operative',
		"sweetAlert": 				'thirdparty/sweetalert.min',
		"scrollReveal": 			'thirdparty/scrollReveal.min',
		"webcam": 					'thirdparty/webcamjs/webcam',
		//PDF
		"pdfMaker":					'thirdparty/pdfmake.min',
		"pdfMakerFonts":			'thirdparty/vfs_fonts',
		//pdfLIB
		//pdfLIB
		"pdfJS":					'thirdparty/pdfJS/pdf',
		"pdf_api":					'thirdparty/pdfJS/lib/display/api',
		"pdf_util":					'thirdparty/pdfJS/lib/shared/util',
		"pdf_pattern":				'thirdparty/pdfJS/lib/shared/pattern',
		"pdf_function":				'thirdparty/pdfJS/lib/shared/function',
		"pdf_annotation":			'thirdparty/pdfJS/lib/shared/annotation',
		"pdf_colorspace":			'thirdparty/pdfJS/lib/shared/colorspace',
		"pdf_metadata":				'thirdparty/pdfJS/lib/display/metadata',
		"pdf_canvas":				'thirdparty/pdfJS/lib/display/canvas',
		"pdf_font_loader":			'thirdparty/pdfJS/lib/display/font_loader',
		//"pdf_compatibility":		'thirdparty/pdfViewer/compatibility',
		//jQuery Plugins
		"jquery": 					'thirdparty/jquery-2.0.1.min',
		"noti5y": 					'thirdparty/noti5y'
	},
	shim: {
		'nodeConnection': {
			exports: 'NodeConnection'
		},
		'modernizr': {
			exports: 'Modernizr'
		},
		'webcam': {
			exports: 'Webcam'
		},
		/** /
		'pdf_util': {
			deps: ["pdfJS"]
		},/**/
		'pdf_pattern': {
			deps: ["pdf_util"]
		},
		'pdf_function': {
			deps: ["pdf_util"]
		},
		'pdf_pattern': {
			deps: ["pdf_util"]
		},
		'pdf_annotation': {
			deps: ["pdf_util"]
		},
		'pdf_canvas': {
			deps: ["pdf_util"]
		},
		'pdf_api': {
			deps: ["pdf_util"]
		},
		'pdf_metadata': {
			deps: ["pdf_util"]
		},
		'pdf_font_loader': {
			deps: ["pdf_util"]
		},
		'pdf_compatibility': {
			deps: ["pdf_util"]
		},
		'pdfMakerFonts': {
			deps: ["pdfMaker"]
		},
		/**/
		'angular': {
			exports: 'angular',
			deps: ["angular-file-upload-shim"]
		},
		'angular-accordion': {
			deps: ["angular"]
		},
		'angular-touch': {
			deps: ["angular"]
        },
		'angular-route': {
			deps: ["angular"]
        },
        'angular-filter': {
			deps: ["angular"]
        },
        'angular-animate': {
			deps: ["angular"]
        },
		'angular-gestures': {
			deps: ["angular"]
		},
		'angular-pagination': {
			deps: ["angular"]
		},
		'autocomplete': {
			deps: ["angular"]
		},
		'bindonce': {
			deps: ["angular"]
		},
		'angular-dialog': {
			deps: ["angular"],
		},
		'angular-tour-html': {
			deps: ["angular"],
		},
		'angular-progress': {
			deps: ["angular"]
		},
        'angular-file-upload': {
			deps: ["angular"]
		},
		'Utils': {
        	deps: ["sjcl"],
			exports: 'Utils'
        },
		'secStore': {
        	deps: ["sjcl"],
			exports: 'secStore'
        },
		'operative': {
			exports: 'operative'
		},
		'humane': {
			exports: 'humane'
		},
		'sweetAlert': {
			exports: 'sweetAlert'
		},
		'jquery': {
			exports: '$'
		},
		'noti5y': {
			exports: 'noti5y'
		}
	},
	waitSeconds: 10,
	priority: [
		"jquery"
	],
	// Use custom property until CEF sets the correct navigator.language
    // NOTE: When we change to navigator.language here, we also should change to
    // navigator.language in ExtensionLoader (when making require contexts for each extension).
	locale: window.localStorage.getItem("locale") || (typeof (brackets) !== "undefined" ? brackets.app.language : navigator.language)

});

/*-------------------------------------------------------------------------------------------------------------------------------*
 *
 *   ~:: BOOTSTRAP ::~
 * 
 * init is the root of the app codebase. This file pulls in all other modules as
 * dependencies (or dependencies thereof), initializes the UI, and binds global menus & keyboard
 * shortcuts to their Commands.
 *
 *-------------------------------------------------------------------------------------------------------------------------------*/
define( function ( require, exports, module ) {

	"use strict";

	// Load dependent non-module scripts
	require("app");

	// Load dependent modules
	var domReady 				= require("domReady"),
		AppInit                 = require("utils/AppInit");

	function _onReady() {

    	// Prevent the browser context menu
		window.document.body.addEventListener("contextmenu", function (e) {
			
			if( e.srcElement.className == "icon-tools" ) {} else {

				//console.log('right-click:', e);

				e.preventDefault();

			}
		
		});	
	
	}

	/**
	 * Setup event handlers prior to dispatching AppInit.HTML_READY
	 */
	function _beforeHTMLReady() {
		
		// Add the platform (mac or win) to the body tag so we can have platform-specific CSS rules
        window.document.body.classList.add("platform-" + brackets.platform);
        
        // Browser-hosted version may also have different CSS (e.g. since '#titlebar' is shown)
        if (brackets.inBrowser) {

			window.document.body.classList.add('in-browser');

		} else {
			
			window.document.body.classList.add('in-appshell');

		}

		// Enable/Disable HTML Menus
		if (brackets.nativeMenus) {
			window.document.body.classList.add("has-appshell-menus");
		}

		// The .no-focus style is added to clickable elements that should
		// not steal focus. Calling preventDefault() on mousedown prevents
		// focus from going to the click target.
		$("html").on( "mousedown", ".no-focus", function (e) {
			// Text fields should always be focusable.
			var $target = $(e.target),
					isTextField =
						$target.is("input[type=text]") ||
						$target.is("input[type=number]") ||
						$target.is("input[type=password]") ||
						$target.is("input:not([type])") || // input with no type attribute defaults to text
						$target.is("textarea");
    
			if (!isTextField) {
				e.preventDefault();
			}
		});

		// Prevent unhandled middle button clicks from triggering native behavior
        // Example: activating AutoScroll (see #510)
		$("html").on( "mousedown", function (e) {
			if (e.button === 1) {
				e.preventDefault();
			}
		});

	}

	// Dispatch htmlReady event
	_beforeHTMLReady();

	AppInit._dispatchReady(AppInit.HTML_READY);

	domReady( function () {

		_onReady();

	});

});
