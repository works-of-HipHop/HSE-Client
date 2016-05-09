/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */

define({

	/**
     * Application General
     */
     "appName"								: "MCM",
     "APP_TITLE"							: "MCM",
     "mainWindowTitle"						: "Mafori Card Manager",
 			
    /**
     * Errors
     */

    // General file io error strings
    "GENERIC_ERROR"							: "(error {0})",
    "NOT_FOUND_ERR"							: "The file could not be found.",
    "NOT_READABLE_ERR"						: "The file could not be read.",
    "NO_MODIFICATION_ALLOWED_ERR"			: "The target directory cannot be modified.",
    "NO_MODIFICATION_ALLOWED_ERR_FILE"		: "The permissions do not allow you to make modifications.",
    "FILE_EXISTS_ERR"						: "The file or directory already exists.",
    "FILE"									: "file",
    "DIRECTORY"								: "directory",

    // File open/save error string
    "ERROR_OPENING_FILE_TITLE"          : "Error opening file",
    "ERROR_OPENING_FILE"                : "An error occurred when trying to open the file <span class='dialog-filename'>{0}</span>. {1}",
    "ERROR_OPENING_FILES"               : "An error occurred when trying to open the following files:",
    "ERROR_RELOADING_FILE_TITLE"        : "Error reloading changes from disk",
    "ERROR_RELOADING_FILE"              : "An error occurred when trying to reload the file <span class='dialog-filename'>{0}</span>. {1}",
    "ERROR_SAVING_FILE_TITLE"           : "Error saving file",
    "ERROR_SAVING_FILE"                 : "An error occurred when trying to save the file <span class='dialog-filename'>{0}</span>. {1}",
    "ERROR_RENAMING_FILE_TITLE"         : "Error renaming file",
    "ERROR_RENAMING_FILE"               : "An error occurred when trying to rename the file <span class='dialog-filename'>{0}</span>. {1}",
    "ERROR_DELETING_FILE_TITLE"         : "Error deleting file",
    "ERROR_DELETING_FILE"               : "An error occurred when trying to delete the file <span class='dialog-filename'>{0}</span>. {1}",
    "INVALID_FILENAME_TITLE"            : "Invalid {0} name",
    "INVALID_FILENAME_MESSAGE"          : "Filenames cannot contain the following characters: /?*:;{}<>\\| or use any system reserved words.",
    "FILE_ALREADY_EXISTS"               : "The {0} <span class='dialog-filename'>{1}</span> already exists.",
    "ERROR_CREATING_FILE_TITLE"         : "Error creating {0}",
    "ERROR_CREATING_FILE"               : "An error occurred when trying to create the {0} <span class='dialog-filename'>{1}</span>. {2}",
 
    "SAVE_CLOSE_TITLE"                  : "Save Changes",
    "SAVE_CLOSE_MESSAGE"                : "Do you want to save the changes you made in the document <span class='dialog-filename'>{0}</span>?",
    "SAVE_CLOSE_MULTI_MESSAGE"          : "Do you want to save your changes to the following files?",
    "EXT_MODIFIED_TITLE"                : "External Changes",
    "CONFIRM_FOLDER_DELETE_TITLE"       : "Confirm Delete",
    "CONFIRM_FOLDER_DELETE"             : "Are you sure you want to delete the folder <span class='dialog-filename'>{0}</span>?",
    "FILE_DELETED_TITLE"                : "File Deleted",
    "EXT_MODIFIED_MESSAGE"              : "<span class='dialog-filename'>{0}</span> has been modified on disk, but also has unsaved changes in {APP_NAME}.<br /><br />Which version do you want to keep?",
    "EXT_DELETED_MESSAGE"               : "<span class='dialog-filename'>{0}</span> has been deleted on disk, but has unsaved changes in {APP_NAME}.<br /><br />Do you want to keep your changes?",
    
    // Find, Replace, Find in Files
    "SEARCH_REGEXP_INFO"                : "Use /re/ syntax for regexp search",
    "FIND_RESULT_COUNT"                 : "{0} results",
    "FIND_RESULT_COUNT_SINGLE"          : "1 result",
    "FIND_NO_RESULTS"                   : "No results",
    "WITH"                              : "With",
    "BUTTON_YES"                        : "Yes",
    "BUTTON_NO"                         : "No",
    "BUTTON_REPLACE_ALL"                : "All\u2026",
    "BUTTON_STOP"                       : "Stop",
    "BUTTON_REPLACE"                    : "Replace",
            
    "BUTTON_NEXT"                       : "\u25B6",
    "BUTTON_PREV"                       : "\u25C0",
    "BUTTON_NEXT_HINT"                  : "Next Match",
    "BUTTON_PREV_HINT"                  : "Previous Match",

    "OPEN_FILE"                         : "Open File",
    "SAVE_FILE_AS"                      : "Save File",
    "CHOOSE_FOLDER"                     : "Choose a folder",

    "RELEASE_NOTES"                     : "Release Notes",
    "NO_UPDATE_TITLE"                   : "You're up to date!",
    "NO_UPDATE_MESSAGE"                 : "You are running the latest version of {APP_NAME}.",

    "FIND_REPLACE_TITLE_PART1"          : "Replace \"",
    "FIND_REPLACE_TITLE_PART2"          : "\" with \"",
    "FIND_REPLACE_TITLE_PART3"          : "\" &mdash; {2} {0} {1}",

    "FIND_IN_FILES_TITLE_PART1"         : "\"",
    "FIND_IN_FILES_TITLE_PART2"         : "\" found",
    "FIND_IN_FILES_TITLE_PART3"         : "&mdash; {0} {1} in {2} {3}",
    "FIND_IN_FILES_SCOPED"              : "in <span class='dialog-filename'>{0}</span>",
    "FIND_IN_FILES_NO_SCOPE"            : "in project",
    "FIND_IN_FILES_FILE"                : "file",
    "FIND_IN_FILES_FILES"               : "files",
    "FIND_IN_FILES_MATCH"               : "match",
    "FIND_IN_FILES_MATCHES"					: "matches",
    "FIND_IN_FILES_MORE_THAN"				: "Over ",
    "FIND_IN_FILES_PAGING"					: "{0}&mdash;{1}",
    "FIND_IN_FILES_FILE_PATH"				: "<span class='dialog-filename'>{0}</span> {2} <span class='dialog-path'>{1}</span>", // We shoudl use normal dashes on Windows instead of em dash eventually
    "ERROR_FETCHING_UPDATE_INFO_TITLE"		: "Error getting update info",
    "ERROR_FETCHING_UPDATE_INFO_MSG"		: "There was a problem getting the latest update information from the server. Please make sure you are connected to the internet and try again.",

    /**
     * Keyboard modifier names
     */
	"KEYBOARD_CTRL"							: "Ctrl",
	"KEYBOARD_ALT"							: "Alt",
	"KEYBOARD_SHIFT"						: "Shift",
	"KEYBOARD_SPACE"						: "Space",

    /**
     * Command Name Constants
     */
	"DASHBOARD"								: "Dashboard",
	"SEARCH"								: "Search",
	"BROWSE"								: "Browse",
    // File menu commands
	"FILE_MENU"								: "File",
	"CMD_FILE_OPEN"							: "Open\u2026",
	"CMD_FILE_CLOSE"						: "Close",
	"CMD_FILE_REFRESH"						: "Refresh MCM",
	"CMD_QUIT"								: "Quit",
    // Used in native File menu on Windows
    "CMD_FILE_LOG_OFF"                    : "Log off",
    "CMD_EXIT"                            : "Exit",

     // Employers menu commands
    "EMPLOYERS_MENU"                      : "Employers",
    "CMD_EMPLOYERS_BROWSE"			  	  : "Browse",
	"CMD_EMPLOYERS_NEW"                   : "Add Employer",

    // Acccount menu commands
    "ACCOUNTS_MENU"                       : "Profiles",
    "CMD_ACCOUNTS_BROWSE"				  : "Browse Profiles",
    "CMD_ACCOUNTS_BROWSE_BEARERS"		  : "Card Bearers",
    "CMD_ACCOUNTS_NEW"                    : "Add a Profile",
    "CMD_ACCOUNTS_NEW_BEARER"             : "Add a Card Bearer",

     // Cards menu commands
    "CARDS_MENU"                       	  : "Cards",
    "CMD_CARDS_BROWSE"                    : "Browse",
    "CMD_CARDS_NEW"                       : "Add a Card",
	"CMD_CARDS_NEW_BATCH"              	  : "Add Multiple Cards",
	"CMD_CARDS_TRANSACTION"            	  : "Add a Transaction",
	"CMD_CARDS_NEW_BATCH_TRANSACTION"     : "Add Batch Transactions",

    // Notification menu commands
    "NOTIFICATIONS_MENU"                  : "Notifications",
    "CMD_NOTIFICATIONS_BROWSE"         	  : "Browse",
    "CMD_NOTIFICATIONS_NEW"               : "Add Notification",
    "CMD_NOTIFICATIONS_TOPUP"             : "Top Up SMS",

    // Acccount menu commands
    "REPORTS_MENU"                        : "Reports",
    "CMD_REPORTS_BROWSE"				  : "Browse",
    
    // View menu commands
    "VIEW_MENU"                           : "View",
    "CMD_HIDE_SIDEBAR"                    : "Hide Sidebar",
    "CMD_SHOW_SIDEBAR"                    : "Show Sidebar",
    "CMD_INCREASE_FONT_SIZE"              : "Increase Font Size",
    "CMD_DECREASE_FONT_SIZE"              : "Decrease Font Size",
    "CMD_RESTORE_FONT_SIZE"               : "Restore Font Size",

    // Help menu commands
	"HELP_MENU"								: "Help",
	"CMD_FAQ"								: "How To...",
	"CMD_API"								: "Browse API",
	"CMD_CHECK_FOR_UPDATE"					: "Check for Updates",
	"CMD_HOW_TO_USE_BRACKETS"				: "How to Use MCM",
	"CMD_FORUM"								: "MCM Support",
	"CMD_RELEASE_NOTES"						: "Release Notes",
	"CMD_REPORT_AN_ISSUE"					: "Report an Issue",
	"CMD_SHOW_EXTENSIONS_FOLDER"			: "Show Extensions Folder",
	"CMD_TWITTER"							: "5ive Design Studio (Pty) Ltd. on Twitter (@MaxVerified)",
	"CMD_ABOUT"								: "About MCM",

	// Help menu commands
	"SETTINGS_MENU"							: "Settings",
	"CMD_CHANGE_DEFAULT_FOLDER"				: "Configuration",
	"CMD_CHANGE_PWD"						: "Change Password",

    // Strings for main-view.html
    "EXPERIMENTAL_BUILD"                   : "experimental build",
    "DEVELOPMENT_BUILD"                    : "development build",
    "OK"                                   : "OK",
    "DONT_SAVE"                            : "Don't Save",
    "SAVE"                                 : "Save",
    "CANCEL"                               : "Cancel",
    "DELETE"                               : "Delete",
    "RELOAD_FROM_DISK"                     : "Reload from Disk",
    "KEEP_CHANGES_IN_EDITOR"               : "Keep Changes in Editor",
    "CLOSE_DONT_SAVE"                      : "Close (Don't Save)",
    "RELAUNCH_CHROME"                      : "Relaunch Chrome",
    "ABOUT"                                : "About",
    "CLOSE"                                : "Close",
    "ABOUT_TEXT_LINE1"                     : "sprint {VERSION_MINOR} {BUILD_TYPE} {VERSION}",
    "ABOUT_TEXT_LINE3"                     : "Notices, terms and conditions pertaining to third party software are located at <a href='{ADOBE_THIRD_PARTY}'>{ADOBE_THIRD_PARTY}</a> and incorporated by reference herein.",
    "ABOUT_TEXT_LINE4"                     : "Documentation and source at <a href='https://github.com/adobe/brackets/'>https://github.com/adobe/brackets/</a>",
    "ABOUT_TEXT_LINE5"                     : "Made with \u2764 and JavaScript by:",
    "ABOUT_TEXT_LINE6"                     : "Lots of people (but we're having trouble loading that data right now).",
    "ABOUT_TEXT_WEB_PLATFORM_DOCS"         : "Web Platform Docs and the Web Platform graphical logo are licensed under a Creative Commons Attribution license, <a href='{WEB_PLATFORM_DOCS_LICENSE}'>CC-BY 3.0 Unported</a>.",
    "UPDATE_NOTIFICATION_TOOLTIP"          : "There's a new build of {APP_NAME} available! Click here for details.",
    "UPDATE_AVAILABLE_TITLE"               : "Update Available",
    "UPDATE_MESSAGE"                       : "Hey, there's a new build of {APP_NAME} available. Here are some of the new features:",
    "GET_IT_NOW"                           : "Get it now!",
    "PROJECT_SETTINGS_TITLE"               : "Project Settings for: {0}",
    "PROJECT_SETTING_BASE_URL"             : "Live Preview Base URL",
    "PROJECT_SETTING_BASE_URL_HINT"        : "To use a local server, enter a url like http://localhost:8000/",
    "BASEURL_ERROR_INVALID_PROTOCOL"       : "The {0} protocol isn't supported by Live Preview&mdash;please use http: or https: .",
    "BASEURL_ERROR_SEARCH_DISALLOWED"      : "The base URL can't contain search parameters like \"{0}\".",
    "BASEURL_ERROR_HASH_DISALLOWED"        : "The base URL can't contain hashes like \"{0}\".",
    "BASEURL_ERROR_INVALID_CHAR"           : "Special characters like '{0}' must be %-encoded.",
    "BASEURL_ERROR_UNKNOWN_ERROR"          : "Unknown error parsing Base URL",
    
    // Extension Management strings
    "INSTALL"                              : "Install",
    "UPDATE"                               : "Update",
    "REMOVE"                               : "Remove",
    "OVERWRITE"                            : "Overwrite",
    "CANT_REMOVE_DEV"                      : "Extensions in the \"dev\" folder must be manually deleted.",
    "CANT_UPDATE"                          : "The update isn't compatible with this version of {APP_NAME}.",
    "INSTALL_EXTENSION_TITLE"              : "Install Extension",
    "UPDATE_EXTENSION_TITLE"               : "Update Extension",
    "INSTALL_EXTENSION_LABEL"              : "Extension URL",
    "INSTALL_EXTENSION_HINT"               : "URL of the extension's zip file or GitHub repo",
    "INSTALLING_FROM"                      : "Installing extension from {0}\u2026",
    "INSTALL_SUCCEEDED"                    : "Installation successful!",
    "INSTALL_FAILED"                       : "Installation failed.",
    "CANCELING_INSTALL"                    : "Canceling\u2026",
    "CANCELING_HUNG"                       : "Canceling the install is taking a long time. An internal error may have occurred.",
    "INSTALL_CANCELED"                     : "Installation canceled.",
    // These must match the error codes in ExtensionsDomain.Errors.* :
    "INVALID_ZIP_FILE"                     : "The downloaded content is not a valid zip file.",
    "INVALID_PACKAGE_JSON"                 : "The package.json file is not valid (error was: {0}).",
    "MISSING_PACKAGE_NAME"                 : "The package.json file doesn't specify a package name.",
    "BAD_PACKAGE_NAME"                     : "{0} is an invalid package name.",
    "MISSING_PACKAGE_VERSION"              : "The package.json file doesn't specify a package version.",
    "INVALID_VERSION_NUMBER"               : "The package version number ({0}) is invalid.",
    "INVALID_BRACKETS_VERSION"             : "The {APP_NAME} compatibility string ({0}) is invalid.",
    "DISALLOWED_WORDS"                     : "The words ({1}) are not allowed in the {0} field.",
    "API_NOT_COMPATIBLE"                   : "The extension isn't compatible with this version of {APP_NAME}. It's installed in your disabled extensions folder.",
    "MISSING_MAIN"                         : "The package has no main.js file.",
    "EXTENSION_ALREADY_INSTALLED"          : "Installing this package will overwrite a previously installed extension. Overwrite the old extension?",
    "EXTENSION_SAME_VERSION"               : "This package is the same version as the one that is currently installed. Overwrite the existing installation?",
    "EXTENSION_OLDER_VERSION"              : "This package is version {0} which is older than the currently installed ({1}). Overwrite the existing installation?",
    "DOWNLOAD_ID_IN_USE"                   : "Internal error: download ID already in use.",
    "NO_SERVER_RESPONSE"                   : "Cannot connect to server.",
    "BAD_HTTP_STATUS"                      : "File not found on server (HTTP {0}).",
    "CANNOT_WRITE_TEMP"                    : "Unable to save download to temp file.",
    "ERROR_LOADING"                        : "The extension encountered an error while starting up.",
    "MALFORMED_URL"                        : "The URL is invalid. Please check that you entered it correctly.",
    "UNSUPPORTED_PROTOCOL"                 : "The URL must be an http or https URL.",
    "UNKNOWN_ERROR"                        : "Unknown internal error.",
    
    /**
     * Unit names
     */

    "UNIT_PIXELS"                               : "pixels",
    
    // extensions/default/DebugCommands
	"DEBUG_MENU"								: "Debug",
	"CMD_SHOW_DEV_TOOLS"						: "Show Developer Tools",
	"CMD_REFRESH_WINDOW"						: "Reload MCM",
	"CMD_NEW_MCM_WINDOW"						: "New MCM Window",
	"CMD_SWITCH_LANGUAGE"						: "Switch Language",
	"CMD_RUN_UNIT_TESTS"						: "Run Tests",
	"CMD_SHOW_PERF_DATA"						: "Show Performance Data",
	"CMD_ENABLE_NODE_DEBUGGER"					: "Enable Node Debugger",
	"CMD_LOG_NODE_STATE"						: "Log Node State to Console",
	"CMD_RESTART_NODE"							: "Restart Node",
	
	"LANGUAGE_TITLE"							: "Switch Language",
	"LANGUAGE_MESSAGE"							: "Language:",

	// Locales (used by Debug > Switch Language)
	"LOCALE_EN"									: "English",
	"LOCALE_AFR"								: "Afrikaans",
	"LOCALE_ZL"									: "isiZulu",
	"LOCALE_XS"									: "isiXhosa",
	"LOCALE_SS"									: "seSotho",

	// extensions/default/RecentProjects
	"CMD_TOGGLE_RECENT_CARDS"					: "Recent Cards",
	
	// extensions/default/WebPlatformDocs
	"DOCS_MORE_LINK"							: "Read more"

});
