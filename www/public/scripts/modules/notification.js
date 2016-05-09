/*-----------------------------------------------------------------
/*	UI NOTIFICATIONS
/*
/*	@param string 	
/*	@param string 	
/*
/*	@return 
/*
/*	@note: uses humane.js for client-side ui notifications & webkitNotifications
/*			for desktop notifications
/*-----------------------------------------------------------------*/

define( [ "humane" ], function( humane ) {

	'use strict';

	// initiate humane notifications 
	var jacked = humane.create({
			baseCls: 'humane-jackedup',
			waitForMove: true
	});

	var noti5y = {

			"icon_url": "http://pam.prepetrol.co.za/assets/wp-content/themes/ppamui/images/icon.png",
			/*---------------------------------------------------------------
			 *	CHECK DESKTOP NOTIFICATIONS SUPPORT	
			 *
			 *	@return bool
			 *--------------------------------------------------------------*/
			check_support: function () {
				return window.webkitNotifications;
			},
			/*---------------------------------------------------------------
			 *	REQUEST PERMISSION FOR DESKTOP NOTIFICATIONS	
			 *
			 *	@return bool
			 *--------------------------------------------------------------*/
			request_permission: function () {

				if( window.webkitNotifications.checkPermission() == 0 ) {

					return true;
				} else {

					window.webkitNotifications.requestPermission();
				}
			},
			/*---------------------------------------------------------------
			 *	CREATE A PLAIN TEXT DESKTOP NOTIFICATION
			 *
			 *	@param string
			 *	@param title
			 *	@param content
			 *
			 *	@return bool
			 *--------------------------------------------------------------*/
			msg: function ( title, content ) {

				var scope = this;
				var icon = scope.icon_url;

				if( scope.request_permission() ) {
				
					window.webkitNotifications.createNotification( icon, title, content ).show();
				}
			},
			/*---------------------------------------------------------------
			 *	SHOW a HUMANE UI notification
			 *
			 *	@param string 	type of notification [ success | error | general ]
			 *	@param string 	msg content
			 *
			 *
			 *--------------------------------------------------------------*/
			log: function ( type, msg ) {

		 		switch ( type ) {

			 		case 'success':

			 			jacked.success = humane.spawn({
							addnCls: 'humane-jackedup-success'
						});

			 			jacked.success(msg);

			 			break;
			 		case 'error':

						jacked.error = humane.spawn({
							addnCls: 'humane-jackedup-error'
						});

						jacked.error(msg);

			 			break;
			 		default:

						jacked.log(msg);

			 			break;
			 	}

			}
	};

	return noti5y;

});