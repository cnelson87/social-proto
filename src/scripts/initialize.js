/**
 * Application Initializer
 * 
 * @author Chris Nelson
 */

var HbsHelpers				= require('config/HandlebarsHelpers');
var Application				= require('./Application');

$(function() {
	// Register Custom Handlebars Helpers
	new HbsHelpers();
	// Initialize Application
	Application.initialize();
});
