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
		GetMac				= require("./thirdparty/getmac");

	/**
     * @constructor
     * Creates a queue of async operations that will be executed sequentially. Operations can be added to the
     * queue at any time. If the queue is empty and nothing is currently executing when an operation is added, 
     * it will execute immediately. Otherwise, it will execute when the last operation currently in the queue 
     * has finished.
     */
    function Utils() {
    }

	Utils.prototype =  {

   		/**
         * Returns Boolean about date parameter
         *
         * @param String.date
         * 
         * @return Boolean
         */
        isDate: function ( date ) {

            //this._strict( [ String ], arguments );
            /** /
            var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
            
            switch( type ) {

                case 'year':

                    break;

                case 'month':

                    break;

                case 'day':

                    break;

                default:

                    return ( ( new Date(date) !== "Invalid Date" && !isNaN( new Date(date) ) ) );

                    break;
            }/**/
            return ( ( new Date(date) !== "Invalid Date" && !isNaN( new Date(date) ) ) );
        
        },

        // Source: http://stackoverflow.com/questions/497790
        convertDate: function( d ) {
            // Converts the date in d to a date-object. The input can be:
            //  a date object: returned without modification
            //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
            //  a number     : Interpreted as number of milliseconds since 1 Jan 1970 (a timestamp) 
            //  a string     : Any format supported by the javascript engine, like
            //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
            //  an object     : Interpreted as an object with year, month and date attributes.  **NOTE** month is 0-11.
            return (
                d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                d.constructor === Number ? new Date(d) :
                d.constructor === String ? new Date(d) :
                typeof d === "object" ? new Date(d.year,d.month,d.date) :
                NaN
            );

        },

        compareDates: function( a, b ) {

            var that = this;
            // Compare two dates (could be of any type supported by the convert
            // function above) and returns:
            //  -1 : if a < b
            //   0 : if a = b
            //   1 : if a > b
            // NaN : if a or b is an illegal date
            // NOTE: The code inside isFinite does an assignment (=).
            return (
                    isFinite(a=that.convertDate(a).valueOf()) &&
                    isFinite(b=that.convertDate(b).valueOf()) ?
                    (a>b)-(a<b) :
                    NaN
            );
        
        },

        DatesInRange: function( d, start, end ) {
                // Checks if date in d is between dates in start and end.
                // Returns a boolean or NaN:
                //    true  : if d is between start and end (inclusive)
                //    false : if d is before start or after end
                //    NaN   : if one or more of the dates is illegal.
                // NOTE: The code inside isFinite does an assignment (=).
               return (
                    isFinite(d=this.convertDate(d).valueOf()) &&
                    isFinite(start=this.convertDate(start).valueOf()) &&
                    isFinite(end=this.convertDate(end).valueOf()) ?
                    start <= d && d <= end :
                    NaN
                );
        
        },

        time_diff: function (t1, t2) {

            var timeStart = new Date("01/01/2007 " + t1).getHours();
            var timeEnd = new Date("01/01/2007 " + t2).getHours();
             
            var hourDiff = timeEnd - timeStart;

            return hourDiff;
        
        },

        generateYears: function( startYear ) {

        	this._strict( [ Number ], arguments );

			var currentYear = new Date().getFullYear(), years = [];
				startYear = startYear || 1900;

			while ( startYear <= currentYear ) {
			
				years.push(startYear++);
			
			} 

        	return years;
		
		},

        date_by_subtracting_days: function(date, days) {

            this._strict( [ Date, Number ], arguments );

            return new Date(
                date.getFullYear(), 
                date.getMonth(), 
                date.getDate() - days,
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            );
        
        }

    };

    var util = new Utils();

	/**
     * @public
     * 
     * Authenticate user
     *      
     * @param {Mysql._mysqlServer}
     * @param {Object.credentials}
	 * @param {Function.callback}
	 * 
     * @return {Object} 
     * 
     */
	function DBAuthenticate ( _mysqlServer, credentials, callback ) {

		//var columns = [ 'ID', 'user_login', 'user_pass', 'user_email', 'display_name' ];

		try {

			_mysqlServer.getConnection( function(err, connection) {
						
				if( err ) {

					callback( err.code );

					// And done with the connection, it has been returned to the pool.
					connection.release();

				} else {

					connection.query( 'SELECT * FROM admin_users WHERE user_email = ? AND user_pass = ?', [ credentials.username, credentials.password ], function( err, result ) {

						if( err ) {

							callback( err.code );

						} else {

							if( result.length < 1 ) {

								callback( 'Username: ' + credentials.username + ' not found.' );

							} else {

								callback( false, result[0] );

							}
						
						};

						// And done with the connection, it has been returned to the pool.
						connection.release();

					});

				}

			});

		} catch( e ) {

			callback( e );

		}
	
	}

    /**
     * @public
     * 
     * Get employees | equipment | operational Data
     *      
     * @param {Mysql._mysqlServer}
     * @param {Object.options}
	 * @param {Function.callback}
	 * 
     * @return {Object} 
     * 
     */
	function DBGetData ( _mysqlServer, options, callback ) {

		var query 	= null,
			result 	= [],
			data 	= {};

		try {

			_mysqlServer.getConnection( function(err, connection) {
						
				if( err ) {

					callback( err.code );

				} else {

					switch( options.type ) {

						case 'configuration':

							var	Data_networkPaths		= [],
								Data_appOptions 		= [],
								Data_additionalPaths	= [];

							var _networkPaths 		= "SELECT networkPaths.* FROM networkPaths ORDER BY ID ASC",
								//_additionalPaths 	= "SELECT additionalPaths.*, networkPaths.Name as rootName, networkPaths.Value as rootPath FROM additionalPaths INNER JOIN networkPaths ON additionalPaths.networkPathID = networkPaths.ID ORDER BY additionalPaths.ID ASC",
								_additionalPaths 	= "SELECT additionalPaths.* FROM additionalPaths ORDER BY ID ASC",
								_appOptions 		= "SELECT options.* FROM options ORDER BY ID ASC";

							query = connection.query( _networkPaths + ";" + _additionalPaths + ";" + _appOptions );

							query
								.on( 'error', function(err) {
									
									//result.push( err );

									callback( err );
									// Handle error, an 'end' event will be emitted after this as well

									// And done with the connection, it has been returned to the pool.
									connection.release();

								})
								.on( 'fields', function(fields) {
									
									// the field packets for the rows to follow
								})
								.on( 'result', function( row, index ) {

									switch ( index ) {

										case 0:

											Data_networkPaths.push( row );

											break;

										case 1:								

											Data_additionalPaths.push( row );

											break;

										case 2:

											Data_appOptions.push( row );

											break;

									};

								})
								.on( 'end', function() {

									callback( false, {
										'networkPaths'		: Data_networkPaths,
										'appOptions'		: Data_appOptions,
										'additionalPaths'	: Data_additionalPaths
									});

									// And done with the connection, it has been returned to the pool.
									connection.release();

								});

							break;

						case 'employees':

							var	Data_users 				= [],
								Data_userMeta 			= [],
								Data_supervisors 		= [];

							var //_users 				= "SELECT users.* FROM users ORDER BY lastName ASC",
								_users 				= "SELECT users.*, userType.Name as userTypeName, occupation.Name as userOccupation, department.Name as departmentName FROM users INNER JOIN userType ON users.userTypeID = userType.ID LEFT JOIN occupation ON users.occupationID = occupation.ID LEFT JOIN department ON users.departmentID = department.ID ORDER BY users.lastName ASC",
								// GOOD: _users 				= "SELECT users.*, userType.Name as userTypeName FROM users INNER JOIN userType ON users.userTypeID = userType.ID ORDER BY lastName ASC",
								_userMeta 			= "SELECT usersMeta.*, dates.Name as dateName FROM usersMeta INNER JOIN dates ON usersMeta.dateID = dates.ID ORDER BY userID ASC",
								_supervisors 		= "SELECT supervisors.* FROM supervisors ORDER BY userID ASC";

							query = connection.query( _users + ";" + _userMeta + ";" + _supervisors );
							query
								.on( 'error', function(err) {
									
									//result.push( err );

									callback( err.code );
									// Handle error, an 'end' event will be emitted after this as well

									// And done with the connection, it has been returned to the pool.
									connection.release();

								})
								.on( 'fields', function(fields) {
									
									// the field packets for the rows to follow
								})
								.on( 'result', function( row, index ) {

									switch ( index ) {

										case 0:

											if( row.userOccupation == null ) {
												row.userOccupation = 'N/A';
											};
											if( row.departmentName == null ) {
												row.departmentName = 'N/A';
											};

											if( row.employeeNumber == null || row.employeeNumber == "" ) {
												row.employeeNumber = 'N/A';
											};
											if( row.idNumber == null || row.idNumber == "" ) {
												row.idNumber = 'N/A';
											};

											if( row.emailAddress == null || row.emailAddress == "" ) {
												row.emailAddress == "N/A";//row.firstName + '.' row.lastName + '@minopex.co.za';
											};

											Data_users.push( row );

											break;

										case 1:

											if( row.value == "0000-00-00 00:00:00" ) {

												row.value = "N/A";

											};

											/** /
											switch( row.dateID ) {

												case 1:

													break;

												case 2:

													break;

												case 3:

													break;

											}/**/

											Data_userMeta.push( row );

											break;

										case 2:

											Data_supervisors.push( row );

											break;

									};

								})
								.on( 'end', function() {

									// loop thru 
									for (var i = 0; i < Data_users.length; i++) {

										if( Data_users[i] ) {

											Data_users[i].displayName = Data_users[i].firstName + ' ' + Data_users[i].lastName;

											Data_users[i].meta = [];

											for (var j = 0; j < Data_userMeta.length; j++) {

												if( Data_users[i].ID == Data_userMeta[j].userID ) {

													// go through meta now...checking for exising equipment meta data
													if( Data_users[i].meta.length > 0 ) {

														var added = false;
														
														for (var k = 0; k < Data_users[i].meta.length; k++) {

															if( Data_users[i].meta[k].equipmentID == Data_userMeta[j].equipmentID ) {

																added = true;

																switch( parseInt(Data_userMeta[j].dateID) ) {

																		case 1: // PTO Date

																			Data_users[i].meta[k].PTODate = Data_userMeta[j].value
																			
																			break;

																		case 2: // Certificate Date

																			Data_users[i].meta[k].certificateDate = Data_userMeta[j].value

																			break;

																		case 3: // Appointment Date

																			Data_users[i].meta[k].appointmentDate = Data_userMeta[j].value

																			break;

																}

															}

														}

														if( added === true ) {} else {

															switch( parseInt(Data_userMeta[j].dateID) ) {

																	case 1: // PTO Date

																			Data_users[i].meta.push({
																				'equipmentID' 	: Data_userMeta[j].equipmentID,
																				'PTODate'		: Data_userMeta[j].value
																			});

																			break;

																	case 2: // Certificate Date

																			Data_users[i].meta.push({
																				'equipmentID' 		: Data_userMeta[j].equipmentID,
																				'certificateDate'	: Data_userMeta[j].value
																			});

																			break;

																	case 3: // Appointment Date

																			Data_users[i].meta.push({
																				'equipmentID' 		: Data_userMeta[j].equipmentID,
																				'appointmentDate'	: Data_userMeta[j].value
																			});

																			break;

															}

														}

													} else {

														switch( parseInt(Data_userMeta[j].dateID) ) {

																case 1: // PTO Date

																	Data_users[i].meta.push({
																		//'dateID' 		: Data_userMeta[j].dateID,
																		//'dateName'		: Data_userMeta[j].dateName,
																		'equipmentID' 	: Data_userMeta[j].equipmentID,
																		'PTODate'		: Data_userMeta[j].value
																	});

																	/** /
																	Data_users[i].meta.push({
																		'dateID' 		: Data_userMeta[j].dateID,
																		//'dateName'		: Data_userMeta[j].dateName,
																		'equipmentID' 	: Data_userMeta[j].equipmentID,
																		'PTODate'		: Data_userMeta[j].value
																	});/**/

																	break;

																case 2: // Certificate Date

																	Data_users[i].meta.push({
																		//'dateID' 			: Data_userMeta[j].dateID,
																		//'dateName'			: Data_userMeta[j].dateName,
																		'equipmentID' 		: Data_userMeta[j].equipmentID,
																		'certificateDate'	: Data_userMeta[j].value
																	});

																	break;

																case 3: // Appointment Date

																	Data_users[i].meta.push({
																		//'dateID' 			: Data_userMeta[j].dateID,
																		//'dateName'			: Data_userMeta[j].dateName,
																		'equipmentID' 		: Data_userMeta[j].equipmentID,
																		'appointmentDate'	: Data_userMeta[j].value
																	});

																	break;

														}

													}

													//Data_users[i].meta.push(Data_userMeta[j]);					

												}

											}

										}

									};

									callback( false, {
										'users'			: Data_users,
										'userMeta'		: Data_userMeta,
										'supervisors'	: Data_supervisors
									});

									// And done with the connection, it has been returned to the pool.
									connection.release();

								});

							break;

						case 'notifications':

							//callback('fuck!');
							
							var Data_notification			= [],
								_notification 				= "SELECT notifications.ID, notifications.date AS notificationDate, notifications.employeeID, notifications.supervisorID, notifications.equipmentID, notifications.dateID, notifications.notificationTypeID, notifications.dateValue, notifications.status, notifications.message, users.firstName, users.lastName, users.idNumber, users.departmentID, users.occupationID, equipment.Name AS equipmentName, dates.Name AS dateName FROM notifications INNER JOIN users ON notifications.employeeID = users.ID INNER JOIN equipment ON notifications.equipmentID = equipment.ID INNER JOIN dates ON notifications.dateID = dates.ID ORDER BY notifications.date ASC";
								//_notification 				= "SELECT notifications.* FROM notifications ORDER BY notifications.date ASC";
							
							query = connection.query( _notification );
							query
								.on( 'error', function(err) {
									
									//result.push( err );

									callback( err.code );
									// Handle error, an 'end' event will be emitted after this as well

									// And done with the connection, it has been returned to the pool.
									connection.release();

								})
								.on( 'fields', function(fields) {
									
									// the field packets for the rows to follow
								})
								.on( 'result', function( row, index ) {

									switch ( index ) {

										case 0:

											row.employeeName = row.firstName + ' ' + row.lastName;

											Data_notification.push( row );

											break;

									};

								})
								.on( 'end', function() {

									callback( false, {
										'notification'			: Data_notification
									});

									// And done with the connection, it has been returned to the pool.
									connection.release();

								});
							

							break;

						case 'equipment':

							var Data_equipment 				= [],
								Data_equipment_dates		= [],
								Data_equipment_occupation	= [];

							var //_equipment 			= "SELECT equipment.* FROM equipment ORDER BY Name ASC",
								_equipment 				= "SELECT equipment.*, equipment_dates.length AS dateLength, dates.Name AS dateName, dates.ID AS dateID FROM equipment INNER JOIN equipment_dates ON equipment.ID = equipment_dates.equipmentID INNER JOIN dates ON equipment_dates.dateID = dates.ID ORDER BY equipment.Name ASC",
								_equipment_dates 		= "SELECT equipment_dates.* FROM equipment_dates ORDER BY ID ASC",
								_equipment_occupation 	= "SELECT equipment_occupation.* FROM equipment_occupation ORDER BY ID ASC";

							var today 	= new Date();
							
							query = connection.query( _equipment + ";" + _equipment_dates + ";" + _equipment_occupation );
							query
								.on( 'error', function(err) {
									
									//result.push( err );

									callback( err.code );
									// Handle error, an 'end' event will be emitted after this as well

									// And done with the connection, it has been returned to the pool.
									connection.release();

								})
								.on( 'fields', function(fields) {
									
									// the field packets for the rows to follow
								})
								.on( 'result', function( row, index ) {

									switch ( index ) {

										case 0:

											row.redDate 	= today;//_date_by_subtracting_days( today, parseInt(row['dateLength']) );
											row.orangeDate 	= today;//_date_by_subtracting_days( today, (parseInt(row['dateLength']) - 30) );

											var found 	= false,
												prefix 	= row['dateName'].replace(/\s+/g, '');
											var prefix1 = prefix + 'DateLength',
												prefix2 = prefix + 'redDate',
												prefix3 = prefix + 'orangeDate',
												result 	= {
													'ID'	: row['ID'],
													'Name'	: row['Name'],
													//'' + prefix1 + '' : row['dateLength'],
													//'' + prefix2 + '' : row['redDate'],
													//'' + prefix3 + '' : row['orangeDate'],
													'data'  : []
												};

												result[prefix1] = row['dateLength'];
												result[prefix2] = row['redDate'];
												result[prefix3] = row['orangeDate'];

											if( Data_equipment.length > 0  ) {

												for (var i = 0; i < Data_equipment.length; i++) {

													if( Data_equipment[i].ID ==  row['ID'] ) { 

														found = true;

														Data_equipment[i][prefix1] = row['dateLength'];
														Data_equipment[i][prefix2] = row['redDate'];
														Data_equipment[i][prefix3] = row['orangeDate'];
														//Data_equipment[i][prefix2] = util.date_by_subtracting_days( today, parseInt(row['dateLength']) );
														//Data_equipment[i][prefix3] = util.date_by_subtracting_days( today, parseInt(row['dateLength']) );

														Data_equipment[i].data.push({
															'dateID'		: row['dateID'],
															'dateName'		: row['dateName'],
															'dateLength'	: row['dateLength'],
															'redDate'		: row['redDate'],
															'orangeDate'	: row['orangeDate']
														});

													}

												}

												if( found == true ) {} else {

													result.data.push({
														'dateID'		: row['dateID'],
														'dateName'		: row['dateName'],
														'dateLength'	: row['dateLength'],
														'redDate'		: row['redDate'],
														'orangeDate'	: row['orangeDate']
													});
												
													Data_equipment.push( result );

												}

											} else { 

												if( found == true ) {} else {

													result.data.push({
														'dateID'		: row['dateID'],
														'dateName'		: row['dateName'],
														'dateLength'	: row['dateLength'],
														'redDate'		: row['redDate'],
														'orangeDate'	: row['orangeDate']
													});
												
													Data_equipment.push( result );

												}
											
											}

											break;

										case 1:

											Data_equipment_dates.push( row );

											break;

										case 2:

											Data_equipment_occupation.push( row );

											break;

									};

								})
								.on( 'end', function() {

									// loop thru 
									for (var i = 0; i < Data_equipment.length; i++) {

										if( Data_equipment[i] ) {

											Data_equipment[i].occupations = [];

											for (var j = 0; j < Data_equipment_occupation.length; j++) {

												if( Data_equipment[i].ID == Data_equipment_occupation[j].equipmentID ) {

													Data_equipment[i].occupations.push(Data_equipment_occupation[j]);

												}

											}

										}

									};

									callback( false, {
										'equipment'				: Data_equipment,
										'equipment_dates'		: Data_equipment_dates,
										'equipment_occupation'	: Data_equipment_occupation
									});

									// And done with the connection, it has been returned to the pool.
									connection.release();

								});

							break;

						case 'hse-data': 

							var Data_dates 				= [],
								Data_department 		= [],
								Data_occupation 		= [],
								Data_userType 			= [],
								Data_supervisors		= [];

							var _dates 				= "SELECT dates.* FROM dates ORDER BY Name ASC",
								_department 		= "SELECT department.* FROM department ORDER BY Name ASC",
								_occupation 		= "SELECT occupation.* FROM occupation ORDER BY Name ASC",
								_userType 			= "SELECT userType.* FROM userType ORDER BY Name ASC",
								_supervisors		= "SELECT supervisors.*, users.firstName, users.lastName, users.idNumber, users.employeeNumber, users.emailAddress, department.Name FROM supervisors INNER JOIN users ON supervisors.userID = users.ID INNER JOIN department ON supervisors.departmentID = department.ID ORDER BY users.lastName ASC";

							query = connection.query( _dates + ";" + _department + ";" + _occupation + ";" + _userType + ";" + _supervisors );
							query
								.on( 'error', function(err) {
									
									//result.push( err );

									callback( err.code );
									// Handle error, an 'end' event will be emitted after this as well

									// And done with the connection, it has been returned to the pool.
									connection.release();

								})
								.on( 'fields', function(fields) {
									
									// the field packets for the rows to follow
								})
								.on( 'result', function( row, index ) {

									switch ( index ) {

										case 0:

											Data_dates.push( row );

											break;

										case 1:

											Data_department.push( row );

											break;

										case 2:

											Data_occupation.push( row );

											break;

										case 3:

											Data_userType.push( row );

											break;

										case 4:

											row.displayName = row.firstName + ' ' + row.lastName;

											Data_supervisors.push( row );

											break;

									};

								})
								.on( 'end', function() {

									callback( false, {
										'dates' 			: Data_dates,
										'department' 		: Data_department,
										'occupation'		: Data_occupation,
										'userType'			: Data_userType,
										'supervisors'		: Data_supervisors
									});

									// And done with the connection, it has been returned to the pool.
									connection.release();

								});

							break;

						default:

							callback( true, 'data type [' + options.type + '] not specified' );

							// And done with the connection, it has been returned to the pool.
							connection.release();

							break;
					
					}

				}

			});

		} catch( e ) {

			callback( e );

		}

	}

	/**
	 * @public
	 * 
	 * Create employees | equipment | operational Data
	 *
	 * @param {Mysql._mysqlServer}
	 * @param {Object.options}
	 * @param {Function.callback}
	 * 
	 * @return {Object} 
	 * 
	 */
	function DBCreateData ( _mysqlServer, options, callback ) {

		var InsertData,
			InsertQuery 	= null;

		try {

			_mysqlServer.getConnection( function(err, connection) {
					
				if( err ) {

					callback( err.code );

				} else {

					switch( options.type ) {

						case 'employee':

							InsertData = {
								'firstName'		: options.data.firstName,
								'lastName'		: options.data.lastName,
								'idNumber'		: options.data.idNumber,
								'employeeNumber': options.data.employeeNumber,
								'emailAddress'	: options.data.emailAddress,
								'occupationID'	: options.data.occupationID,
								'departmentID'	: options.data.departmentID,
								'userTypeID'	: options.data.userTypeID
							};

							InsertQuery = "INSERT INTO users SET ?";
																								
							connection.query( InsertQuery, InsertData, function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {
																			
									callback( false, 'Employee added successfully.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();
							
							});

							break;

						case 'equipment':

							InsertData = {
								'Name'		: options.data.Name
							};
							InsertQuery = "INSERT INTO equipment SET ?";
																								
							connection.query( InsertQuery, InsertData, function( err, dbb ) {

								if( err ) {

									callback( err.code );

									// And done with the connection, it has been returned to the pool.
									connection.release();

								} else {

									var dateCounter = 0;

									for (var i = 1; i < 4; i++) {
											
										dateCounter++;

										switch( i ) {

												case 1:

													var Data = {
														'equipmentID'	: dbb.insertId,
														'dateID'		: i,
														'length'		: options.data.PTODateLength
													};

													break;

												case 2:

													var Data = {
														'equipmentID'	: dbb.insertId,
														'dateID'		: i,
														'length'		: options.data.CertificateDateLength
													};

													break;

												case 3:

													var Data = {
														'equipmentID'	: dbb.insertId,
														'dateID'		: i,
														'length'		: options.data.AppointmentDateLength
													};

													break;
										};							
																					
										connection.query( "INSERT INTO equipment_dates SET ?", Data, function( error, results ) {

											if( error ) {

												if( (dateCounter + 1) >= 4 ) {

													callback( err.code + ' ' + error.code );

													// And done with the connection, it has been returned to the pool.
													connection.release();

												}

											} else {
														
												if( (dateCounter + 1) >= 4 ) {
													
													callback( false, 'Equipment and dates (' + dateCounter + ') added successfully.' );

													// And done with the connection, it has been returned to the pool.
													connection.release();
														
												}

											}
										
										});

									}

								}
							
							});
							
							break;

						case 'equipment-occupation':

							InsertData = {
								'equipmentID'		: options.data.equipmentID,
								'occupationID'		: options.data.occupationID
							};
							InsertQuery = "INSERT INTO equipment_occupation SET ?";
															
							connection.query( InsertQuery, InsertData, function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {
										
									callback( false, 'Equipment, Occupation-allocation set.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'notification':

							InsertData = {
								'employeeID'			: options.data.employeeID,
								'supervisorID'			: options.data.supervisorID,
								'equipmentID'			: options.data.equipmentID,
								'dateID'				: options.data.dateID,
								'dateValue'				: options.data.dateValue,
								'notificationTypeID'	: options.data.notificationTypeID,
								'status'				: 3,//options.data.status,
								'message'				: 'N/A'
							};
							InsertQuery = "INSERT INTO notifications SET ?";
																								
							connection.query( InsertQuery, InsertData, function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {

									callback( false, 'Notification added successfully.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();
							
							});

							break;

						case 'occupation':

							InsertData = {
								'Name'		: options.data.Name
							};
							InsertQuery = "INSERT INTO occupation SET ?";
																								
							connection.query( InsertQuery, InsertData, function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {
																			
									callback( false, 'Occupation added successfully.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'department':

							InsertData = {
								'Name'		: options.data.Name
							};
							InsertQuery = "INSERT INTO department SET ?";
																								
							connection.query( InsertQuery, InsertData, function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {
																			
									callback( false, 'Department added successfully.');

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'date':

							InsertData = {
								'Name'		: options.data.Name
							};
							InsertQuery = "INSERT INTO dates SET ?";
																								
							connection.query( InsertQuery, InsertData, function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {
																		
									callback( false, 'Date added successfully.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'supervisor':

							InsertQuery = "INSERT INTO supervisors SET ?";
							InsertData 	= {
								'departmentID'		: options.data.departmentID,
								'userID'			: options.data.userID,
								'supervisorPass'	: options.data.supervisorPass,
								'appointmentDate'	: options.data.appointmentDate
							};

							connection.query( InsertQuery, InsertData, function( error, results ) {

								if ( error ) {

									callback( error );

								} else {

									callback( false, 'Supervisor created successfully.' );
								
								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'log':

							GetMac.getMac( function( err, macAddress ) {

								if( err ) {

									callback( err );

								} else {	

									InsertData = {
										'macAddress'	: macAddress,
										//'last_login'	: '',
										'hostMachine'	: os.hostName()
									};

									InsertQuery = "INSERT INTO hseClients SET ?";
												
									connection.query( InsertQuery, InsertData, function( error, dbb ) {

										if( error ) {

											callback( error.code );

										} else {
																					
											callback( false, 'Log added successfully.' );

										}

										// And done with the connection, it has been returned to the pool.
										connection.release();

									});
							
								}

							});

							break;

						default:

							callback( 'create data type [' + options.type + '] not specified' );

							// And done with the connection, it has been returned to the pool.
							connection.release();

							break;

					}

				}

			});

		} catch( e ) {

			callback( e );

		}

	}

	/**
	 * @public
	 * 
	 * Create employees | equipment | operational Data
	 *
	 * @param {Mysql._mysqlServer}
	 * @param {Object.options}
	 * @param {Function.callback}
	 * 
	 * @return {Object} 
	 * 
	 */
	function DBUpdateData ( _mysqlServer, options, callback ) {

		var query 	= null,
			data 	= {};

		try {

			_mysqlServer.getConnection( function(err, connection) {
					
				if( err ) {

					callback( err.code );

				} else {

					switch( options.type ) {

						case 'employee':

							query = "UPDATE users SET ? WHERE ID = ?";
							data = {
								'firstName'		: options.data.firstName,
								'lastName'		: options.data.lastName,
								'idNumber'		: options.data.idNumber,
								'employeeNumber': options.data.employeeNumber,
								'emailAddress'	: options.data.emailAddress,
								'occupationID'	: options.data.occupationID,
								'departmentID'	: options.data.departmentID,
								'userTypeID'	: options.data.userTypeID
							};

							connection.query( query, [data, options.data.ID], function( error, results ) {
										
								if ( error ) {

									callback( error.code );

								} else {

									callback( false, options.data.firstName + ' ' + options.data.lastName + ' updated successfully.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'employee-equipment':

							// find current relationships
							connection.query( "SELECT usersMeta.* FROM usersMeta WHERE userID = ?", [options.data.userID], function( error, results ) {

								if ( error ) {

									callback( error.code );

									// And done with the connection, it has been returned to the pool.
									connection.release();

								} else {

									if( results.length > 0 ) {

										// existing relationships inserts +/ updates

										var toBeRemoved = 0;
										var updated 	= 0;
										var added 		= [];

										var resultsID 	= [];
										var insertions 	= 0;

										for (var j = 0; j < results.length; j++) {

											insertions++;

											if( options.data.dateID == results[j].dateID && options.data.userID == results[j].userID && options.data.equipmentID == results[j].equipmentID ) {

												//update & splice occupations statement
												//updated++;
												callback( false, 'Equipment updated');

												// And done with the connection, it has been returned to the pool.
												connection.release();

												return;

											}

										}

										// no relationships...just inserts
										var errors = [],
											InsertData = {
													'userID'		: options.data.userID,
													'equipmentID'	: options.data.equipmentID,
													'dateID'		: options.data.dateID,
													'value'			: options.data.dateValue
											},
											InsertQuery = "INSERT INTO usersMeta SET ?";

										connection.query( InsertQuery, InsertData, function( err, dbb ) {

											insertions++;

											if( err ) {

												callback( err.code );
															
											} else {

												callback( false, 'Equipment Allocated successfully.' );

											}

											// And done with the connection, it has been returned to the pool.
											connection.release();

										});

									} else {

										var insertions = 0;

										// no relationships...just inserts
										var errors = [],
											InsertData = {
													'userID'		: options.data.userID,
													'equipmentID'	: options.data.equipmentID,
													'dateID'		: options.data.dateID,
													'value'			: options.data.dateValue
											},
											InsertQuery = "INSERT INTO usersMeta SET ?";

										connection.query( InsertQuery, InsertData, function( err, dbb ) {

											insertions++;

											if( err ) {

												//errors.push(err);

												callback( err.code );
					
											} else {

												callback( false, 'Equipment Allocated successfully.' );

											}

											// And done with the connection, it has been returned to the pool.
											connection.release();

										});

									}
								
								}
							
							});

							break;

						case 'employee-equipment-update':

							connection.query( "SELECT usersMeta.* FROM usersMeta WHERE userID = ?", [options.data.userID], function( error, results ) {

								if ( error ) {

									callback( error.code );

									// And done with the connection, it has been returned to the pool.
									connection.release();

								} else {

									if( results.length > 0 ) {

										// existing relationships inserts +/ updates

										var toBeRemoved = 0;
										var updated 	= 0;
										var added 		= [];

										var resultsID 	= [];
										var insertions 	= 0;

										for (var j = 0; j < results.length; j++) {

											insertions++;

											if( parseInt(options.data.dateID) == results[j].dateID && parseInt(options.data.userID) == results[j].userID && parseInt(options.data.equipmentID) == results[j].equipmentID ) {

												//callback( false, 'Employee Equipment Dates updated successfully.' );
												
												var updateData = {
													'value'			: options.data.value
												};

												connection.query( "UPDATE usersMeta SET ? WHERE ID = ? ", [updateData, results[j].ID], function( error, outcome ) {
																	
													if ( error ) {

														callback( error.code );

													} else {

														callback( false, 'Employee Equipment Dates updated successfully.' );
													}

													// And done with the connection, it has been returned to the pool.
													connection.release();

												});

											}

										}

									} else {

										callback('Employee has no equipment allocated.');

										// And done with the connection, it has been returned to the pool.
										connection.release();

									}

								}
							
							});

							break;

						case 'equipment':

							query = "UPDATE equipment SET ? WHERE ID = ?";
							data = {
								'Name'		: options.data.Name
							};

							connection.query( query, [data, options.data.ID], function( error, results ) {
												
								if ( error ) {

									callback( error.code );

									// And done with the connection, it has been returned to the pool.
									connection.release();

								} else {

									var nbLength =  options.data.occupations.length;

									if( nbLength > 0 ) {

										var errors = [];

										// find current relationships
										connection.query( "SELECT equipment_occupation.* FROM equipment_occupation WHERE equipmentID = ?", [options.data.ID], function( error, results ) {

											if ( error ) {

												callback( error.code );

												// And done with the connection, it has been returned to the pool.
												connection.release();

											} else {

												if( results.length > 0 ) {

													// existing relationships inserts +/ updates

													var toBeRemoved = 0;
													var updated = 0;
													var added = [];

													var resultsID = [];

													for (var j = 0; j < results.length; j++) {

														//if( options.data.occupations[i] == results[j].ID ) {

														if( options.data.occupations.indexOf( results[j].ID ) !== -1 ) {

															//update & splice occupations statement
															updated++;

														} else {

															// delete query
															//toBeRemoved++;

															/**/
															var deleteQuery = "DELETE FROM equipment_occupation WHERE ID = ?";

															connection.query( deleteQuery, [results[j].ID], function( err, dbb ) {

																if( err ) {

																	//errors.push(err);

																} else {

																	toBeRemoved++;

																	//callback( 'Equipment updated successfully and occupation allocation set.' );

																}

															});/**/
																	
														}

														resultsID.push(results[j].ID);

													}

													var array3 = options.data.occupations.filter(function(obj) { return resultsID.indexOf(obj) == -1; });

													// if occupations > 0 insert entries (means occupation is new and was not in existing db results)
													if( options.data.occupations.length !== updated && ( (options.data.occupations.length - updated) == array3.length )  ) {

														for (var h = 0; h < array3.length; h++) {
																	
															var InsertData = {
																	'equipmentID'		: options.data.ID,
																	'occupationID'		: array3[h]
																},
																InsertQuery = "INSERT INTO equipment_occupation SET ?";
																								
															connection.query( InsertQuery, InsertData, function( err, dbb ) {

																if( err ) {

																	errors.push(err);

																} else {
																			
																	//callback( 'Equipment, Occupation-allocation set.' );

																}

															});

														};

														//callback( false, 'Equipment & Occupation [' + updated + ' allocations / ' + results.length + '] updated successfully. Allocations to be added ' + array3.length + '. Allocations to be removed ' + toBeRemoved + ' ...not really', results );
														callback( false, 'Equipment updated successfully and occupation allocations set.' );

													} else {

														//callback( false, 'Equipment & Occupation [' + updated + ' allocations / ' + results.length + '] updated successfully. Allocations Removed ' + toBeRemoved + '. Allocations to be added ' + (options.data.occupations.length - updated) + ' . ...not really', results );
														callback( false, 'Equipment updated successfully and occupation allocations set.' );

													}

													// And done with the connection, it has been returned to the pool.
													connection.release();							

												} else {

													// no relationships...just inserts

													for ( var i = 0; i < nbLength; i++ ) {
									
														var InsertData = {
															'equipmentID'		: options.data.ID,
															'occupationID'		: options.data.occupations[i]
														},
														InsertQuery = "INSERT INTO equipment_occupation SET ?";
															
														connection.query( InsertQuery, InsertData, function( err, dbb ) {

															if( err ) {

																errors.push(err);

															} else {

																//callback( 'Equipment updated successfully and occupation allocation set.' );

															}

														});
															
														//Things[i]
												
													};

													if( errors.length > 0 ) {

														callback( errors );

													} else {
														
														callback( false, 'Equipment updated successfully and occupation allocations set.' );
												
													}

													// And done with the connection, it has been returned to the pool.
													connection.release();

												}

											}
										
										});
										
									} else {

										callback( false, 'Equipment updated successfully.' );

										// And done with the connection, it has been returned to the pool.
										connection.release();

									}

								}

							});

							/** /
							_mysqlServer.connect();

							_mysqlServer.beginTransaction( function( err ) {
			  				
			  					if ( err ) { 
			  						
			  						_mysqlServer.rollback( function() {

										callback( err );
										
									});

			  					} else {

									_mysqlServer.query( query, [data, options.data.ID], function( error, results ) {
												
										if ( error ) {

											_mysqlServer.rollback( function() {

												callback( error );
												
											});
											//callback( error );

										} else {

											_mysqlServer.commit( function( errr ) {
												
												if (errr) { 
															
													_mysqlServer.rollback( function() {

														callback( error );
															
													});
														
												} else {

													callback( 'Equipment updated successfully.' );
												}
											
											});

											//callback( 'Equipment updated successfully.' );

										}

									});

								}
							});/**/

							//callback( 'User updated successfully...Nearly' );

							break;

						case 'occupation':

							query = "UPDATE occupation SET ? WHERE ID = ?";
							data = {
								'Name'		: options.data.Name
							};

							connection.query( query, [data, options.data.ID], function( error, results ) {
												
								if ( error ) {

									callback( error.code );

								} else {

									callback( false, 'Occupation updated successfully.' );
								
								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'department':

							query = "UPDATE department SET ? WHERE ID = ?";
							data = {
								'Name'		: options.data.Name
							};

							connection.query( query, [data, options.data.ID], function( error, results ) {
												
								if ( error ) {

									callback( error.code );

								} else {

									callback( false, 'Department updated successfully.' );
								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;
						
						case 'supervisor':

							query = "UPDATE supervisor SET ? WHERE ID = ?";
							data = {
								'userID'		: options.data.userID
							};

							connection.query( query, [data, options.data.departmentID], function( error, results ) {
												
								if ( error ) {

									callback( error.code );

								} else {

									callback( false, 'Supervisor updated successfully.' );
								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'notification':

							query = "UPDATE notifications SET ? WHERE ID = ?";
							data = {
								'status'		: options.data.status,
								'message'		: options.data.message
							};

							connection.query( query, [data, options.data.ID], function( error, results ) {
												
								if ( error ) {

									callback( error.code );

								} else {

									callback( false, 'Notification updated successfully.' );
								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						default:

							callback( 'data type [' + options.type + '] not specified' );

							// And done with the connection, it has been returned to the pool.
							connection.release();

							break;
							
					}

				}

			});
		
		} catch( e ) {

			callback( e );

		}

	}

	/**
	 * @public
	 * 
	 * Delete employees | equipment | operational Data
	 *
	 * @param {Mysql._mysqlServer}
	 * @param {Object.options}
	 * @param {Function.callback}
	 * 
	 * @return {Object} 
	 * 
	 */
	function DBDeleteData ( _mysqlServer, options, callback ) {

		var deleteQuery = null;

		try {

			_mysqlServer.getConnection( function(err, connection) {
					
				if( err ) {

					callback( err.code );

				} else {

					switch( options.type ) {

						case 'employee':

							deleteQuery = "DELETE FROM users WHERE ID = ?";

							connection.query( deleteQuery, [options.data.ID], function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {

									callback( false, 'Employee deleted successfully.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'employee-equipment':

							deleteQuery = "DELETE FROM usersMeta WHERE userID = ? AND equipmentID = ?";

							connection.query( deleteQuery, [options.data.userID, options.data.equipmentID], function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {

									callback( false, 'Employee equipment removed successfully.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'equipment':

							deleteQuery = "DELETE FROM equipment WHERE ID = ?";

							connection.query( deleteQuery, [options.data.ID], function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {

									callback( false, 'Equipment deleted successfully.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'occupation':

							deleteQuery = "DELETE FROM occupation WHERE ID = ?";

							connection.query( deleteQuery, [options.data.ID], function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {


									callback( false, 'Occupation deleted successfully.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'department':

							deleteQuery = "DELETE FROM department WHERE ID = ?";

							connection.query( deleteQuery, [options.data.ID], function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {

									callback( false, 'Department deleted successfully.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'supervisor':

							deleteQuery = "DELETE FROM supervisors WHERE userID = ? AND departmentID = ?";

							connection.query( deleteQuery, [options.data.userID, options.data.departmentID ], function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {

									callback( false, 'Supervisor deleted successfully.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						case 'date':

							deleteQuery = "DELETE FROM dates WHERE ID = ?";

							connection.query( deleteQuery, [options.data.ID], function( err, dbb ) {

								if( err ) {

									callback( err.code );

								} else {

									callback( false, 'Date deleted successfully.' );

								}

								// And done with the connection, it has been returned to the pool.
								connection.release();

							});

							break;

						default:

							callback( 'data type [' + options.type + '] not specified' );

							// And done with the connection, it has been returned to the pool.
							connection.release();

							break;
							
					}

				}

			});

		} catch( e ) {

			callback( e );

		}

	}

	/**
	 *---------------------------------------------------------
	 *
     * @public
     * 
     * AUXILLARY FUNCTIONS
     *
     ----------------------------------------------------------*/

	/**
	 * @private
	 * 
	 * Return 
	 *
	 * @return {Array}
	 *
	 */
	function _finYears() {

					var years 	= [];
					var addYear = 1;
					var yearsRunning = workingDate.year - 2013;

					years.push( {
						'year'		: 2013,
						'months'	: _finMonths( 2013 ),						
					} );

					for ( yearsRunning; yearsRunning > 0; yearsRunning-- ) {

						years.push({
							'year'		: 2013 + addYear,
							'months'	: _finMonths( 2013 + addYear ),
						});

						addYear++;
						
					};

					return years;

	}

	/**
	 * @private
	 * 
	 * 
	 *
	 * @param {String.Year}
	 * 
	 * @return {Object}
	 *
	 */
	function _finMonths( year ) {

					var monthObj, totalFeb;

					if ( (year%100!=0) && (year%4==0) || (year%400==0) ) {

						totalFeb = 29;

					} else {  

						totalFeb = 28;  
					}  

					monthObj = {
						'01': { 
								days: "31",
								name: "January" 
						},
						'02': {
								days: "" + totalFeb + "",
								name: "February"
						},
						'03': { 
								days: "31",
								name: "March" 
						},
						'04': { 
								days: "30",
								name: "April" 
						},
						'05': { 
								days: "31",
								name: "May" 
						},
						'06': { 
								days: "30",
								name: "June" 
						},
						'07': { 
								days: "31",
								name: "July" 
						},
						'08': { 
								days: "31",
								name: "August" 
						},
						'09': { 
								days: "30",
								name: "September" 
						},
						'10': { 
								days: "31",
								name: "October" 
						},
						'11': { 
								days: "30",
								name: "November" 
						},
						'12': { 
								days: "31",
								name: "December"
						}
					};

					return monthObj;
	
	}

	/**
	 * @private
	 * 
	 * Return last calendar day of the month
	 *
	 * @param {String.Year}
	 * @param {String.Month}
	 * 
	 * @return {String}
	 *
	 */
	function _LastDayOfMonth(Year, Month) {

					Utils._strict( [ String, String ], arguments );

					return new Date( (new Date(Year, Month,1))-1 ).getDate();
				
	}

	// Source: http://stackoverflow.com/questions/497790
	function convertDate ( d ) {
            // Converts the date in d to a date-object. The input can be:
            //  a date object: returned without modification
            //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
            //  a number     : Interpreted as number of milliseconds since 1 Jan 1970 (a timestamp) 
            //  a string     : Any format supported by the javascript engine, like
            //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
            //  an object     : Interpreted as an object with year, month and date attributes.  **NOTE** month is 0-11.
            return (
                d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                d.constructor === Number ? new Date(d) :
                d.constructor === String ? new Date(d) :
                typeof d === "object" ? new Date(d.year,d.month,d.date) :
                NaN
            );

	}

	function compareDates ( a, b ) {

            //var that = this;
            // Compare two dates (could be of any type supported by the convert
            // function above) and returns:
            //  -1 : if a < b
            //   0 : if a = b
            //   1 : if a > b
            // NaN : if a or b is an illegal date
            // NOTE: The code inside isFinite does an assignment (=).
            return (
                    isFinite(a=convertDate(a).valueOf()) &&
                    isFinite(b=convertDate(b).valueOf()) ?
                    (a>b)-(a<b) :
                    NaN
            );
        
	}

	function DatesInRange ( d, start, end ) {
                // Checks if date in d is between dates in start and end.
                // Returns a boolean or NaN:
                //    true  : if d is between start and end (inclusive)
                //    false : if d is before start or after end
                //    NaN   : if one or more of the dates is illegal.
                // NOTE: The code inside isFinite does an assignment (=).
               return (
                    isFinite(d=convertDate(d).valueOf()) &&
                    isFinite(start=convertDate(start).valueOf()) &&
                    isFinite(end=convertDate(end).valueOf()) ?
                    start <= d && d <= end :
                    NaN
                );
        
	}

	function time_diff (t1, t2) {

            var timeStart = new Date("01/01/2007 " + t1).getHours();
            var timeEnd = new Date("01/01/2007 " + t2).getHours();
             
            var hourDiff = timeEnd - timeStart;

            return hourDiff;
        
	}

	function generateYears ( startYear ) {

        	this._strict( [ Number ], arguments );

			var currentYear = new Date().getFullYear(), years = [];
				startYear = startYear || 1900;

			while ( startYear <= currentYear ) {
			
				years.push(startYear++);
			
			} 

        	return years;
	
	}

	/**
     * Iterates over all the properties in an object or elements in an array. Differs from
     * $.each in that it always iterates over the properties of an object, even if it has a length
     * property making it look like an array.
     * 
     * @param {*} object The object or array to iterate over.
     * @param {function(value, key)} callback The function that will be executed on every object.
     */
    function localForEach ( object, callback ) {

		// this._strict( [ Object, Function ], arguments );

		var keys = Object.keys(object),
			len = keys.length,
			i;
            
		for (i = 0; i < len; i++) {
			callback(object[keys[i]], keys[i]);
		}

    }

	exports.DBAuthenticate 		= DBAuthenticate;
	
	exports.DBGetData 			= DBGetData;
	exports.DBCreateData 		= DBCreateData;
	exports.DBDeleteData 		= DBDeleteData;
	exports.DBUpdateData 		= DBUpdateData;

}());