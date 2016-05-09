/*
 * Copyright (c) 2015 @MaxVerified on behalf of 5ive Design Studio (Pty) Ltd. All rights reserved.
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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, evil:true */
/*global window, document:true, CollectionUtils:true */

window.setTimeout( function () {
	
	"use strict";
    
	var deps = { "Angular": window.angular, "jQuery": window.$, "RequireJS": window.require };
	var key, missingDeps = [];
	for (key in deps) {
		if (deps.hasOwnProperty(key) && !deps[key]) {
			missingDeps.push(key);
		}
	}
	if (missingDeps.length === 0) {
		return;
	}


    /*
     * New Document Class
     * ------------------------------------------*/
	var ref = document.body;
	ref.className += ' refresh-UI';

    /*
     * New Document Frag
     * ------------------------------------------*/
    var frag = document.createDocumentFragment();

    // Title
    var Title = document.createElement('h1');
		Title.className = 'tc FiraFont';
		Title.innerHTML = 'Phola Coal - HSE';
	//frag.appendChild( Title );

	//frag.appendChild( document.createElement("hr") );
	frag.appendChild( document.createElement("br") );
	frag.appendChild( document.createElement("br") );

	// Message
	var Msg = document.createElement('p');
		Msg.className = 'tc';
		//Msg.innerHTML = 'Phola Coal HSE System';
	//frag.appendChild( Msg );
	var Msg2 = document.createElement('p');
		Msg2.className = 'tc';
		//Msg2.innerHTML = 'If you\'re running from a local copy of the Sauce, please make sure submodules are updated.';
	//frag.appendChild( Msg2 );

	frag.appendChild( document.createElement("br") );

	// Missing dependencies
	var missinglibs = document.createElement('ul');
	missingDeps.forEach( function (key) {
		
		var y1 =  document.createElement('li');
			y1.innerHTML = key;

		missinglibs.appendChild( y1 );
	});
	//frag.appendChild( missingDeps );

	// Action
	var btn = document.createElement('a');
		btn.className = 'tc btn btn-success btn-reloader btn-block menu-trigger FiraFont start-button';
		btn.href = 'javascript:window.location.reload();';
		//btn.innerHTML = '';
	var icon = document.createElement('span');
		icon.className = 'icon-switch2';
	var txt = document.createElement('span');
		txt.className = 'instructions';
		txt.innerHTML = 'Load HSE';
	btn.appendChild( icon );
	//btn.appendChild( txt );
	frag.appendChild( btn );
	
	// ADD TO BODY
    ref.innerHTML = '<br />';
	ref.appendChild( frag );

}, 1000);