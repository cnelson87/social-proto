/**
 * Application Config
 */

if (!window.location.origin) {
	//ie9 fix
	window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

var AppConfig = {

	siteUrl: window.location.origin,
	isIE9: navigator.userAgent.indexOf('MSIE 9') != -1,

	hasPointerEvents: Modernizr.pointerevents,
	hasMediaQueries: Modernizr.mq('only all'),
	hasTouch: Modernizr.touch,

	ajaxUrl: 'http://api.massrelevance.com/ZachHenault/coffee.json',
	ajaxLimit: 6,

	breakpoints: {
		1: 'mobile',
		2: 'tablet',
		3: 'desktop'
	},
	currentBreakpoint: null

};

module.exports = AppConfig;