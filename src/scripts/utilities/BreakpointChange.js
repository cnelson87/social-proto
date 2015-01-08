/*
	TITLE: BreakpointChange

	DESCRIPTION: Create pseudo 'breakpointChange' event

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+

*/

var AppConfig			= require('config/AppConfig');
var AppEvents			= require('events/AppEvents');
var PubSub				= require('utilities/PubSub');

var BreakpointChange = function() {

	var $elIndicator = $('<div></div>',{
		'id': 'breakpoint-indicator'
	}).appendTo($('body'));
	var zIndex = $elIndicator.css('z-index');

	AppConfig.currentBreakpoint = AppConfig.breakpoints[zIndex];

	$(window).on('resize', function(e) {
		var newZI = $elIndicator.css('z-index');
		if (newZI !== zIndex) {
			zIndex = newZI;
			AppConfig.currentBreakpoint = AppConfig.breakpoints[zIndex];
			PubSub.trigger(AppEvents.BREAKPOINT_CHANGE, {breakpoint: AppConfig.currentBreakpoint});
		}
	});

};

module.exports = BreakpointChange;
