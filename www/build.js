({
	paths: {
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
	out: 'production/app-min.js',
	name: 'app',
	/**/
	wrap: true,
	priority: [
		"jquery"
	]
})
