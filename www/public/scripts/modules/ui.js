/**
* Copyright (c) 2013 @MaxVerified on behalf of 5ive Design Studio (Pty) Ltd. 
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*	http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

define( function ( require, exports, module ) {
    
    'use strict';

	// Load dependent modules
	var $ 			= require("jquery"),
		domReady 	= require("domReady"),
		noti5y 		= require("noti5y"),
		NProgress 	= require("NProgress");

	/*
	 * Ajax Loading UI
	 * ------------------------------------------------*/
	NProgress.configure({ 
		showSpinner: true 
	});

	NProgress.start();

	/*
	 * UI Notifications
	 * ------------------------------------------------* /
	if( noti5y.check_support() ){

		if(noti5y.request_permission()) {

			noti5y.msg( 'A Message from DirecTree', 'App Notifications are now on.');
			noti5y.log('success','Notifications on');
		}
	} else {
		noti5y.log('error','Notifications aren\'t supported on this Browser / OS version. ')
	}

	/*
	 * Event Listeners
	 * ------------------------------------------------* /
	// Prevent the browser context menu since Brackets creates a custom context menu
	$(window).contextmenu(function (e) {
		e.preventDefault();
	});

	/*
     * General menu event processing
     */
    // Prevent clicks on top level menus and menu items from taking focus
	$(window.document).on("mousedown", ".dropdown", function (e) {
		e.preventDefault();
	});

    // Switch menus when the mouse enters an adjacent menu
    // Only open the menu if another one has already been opened by clicking
	$(window.document).on( "mouseenter", "#titlebar .dropdown", function (e) {
			
		var open = $(this).siblings(".open");
			
		if (open.length > 0) {
			open.removeClass("open");
			$(this).addClass("open");
		}
	});

	/*	--------------------------------------------------*/
	/*	:: SCROLL TO TOP
	/*	--------------------------------------------------*/

	var toTop_btn = document.querySelector( '#scrolltotop' );

	if( toTop_btn === null ) {} else {

		$(toTop_btn).css( 'display', 'none' );//hiding & init the element first

		$(toTop_btn).on( 'click', function () {
			$('html, body').animate({ scrollTop: 0 }, 500);
			return false;
		});

		window.addEventListener('scroll', function() {

			var $header_height = $( '#branding' ).outerHeight();
			var goTop = $(toTop_btn).offset().top; //accounting offset top of the element on the page
			var y = $(window).scrollTop(); //topOfpage var ini

			if ( y > $header_height ) {
				 $(toTop_btn).fadeIn('fast');//css('display', 'block');
			} else {
				 $(toTop_btn).fadeOut('fast');//css('display', 'none');
			};
			
			clearTimeout( timer );
			
			if ( !body.classList.contains('disable-hover') ) {
				body.classList.add('disable-hover')
			}
	  
			timer = setTimeout( function(){
				body.classList.remove( 'disable-hover' )
			},500 );

		}, false);
	
	}	
	
	/*
	 * initialise browsing
	 * ------------------------------------------------*/

	domReady( function () {

		NProgress.inc();

		//window.App = Application;

		NProgress.done();
	
	});
	/**/
});