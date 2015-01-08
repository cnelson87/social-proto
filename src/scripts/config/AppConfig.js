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

	hasTouch: Modernizr.touch,

	// ajaxUrl: 'http://api.massrelevance.com/ZachHenault/coffee.json',
	ajaxUrl: 'http://api.massrelevance.com/ill_adelphia/john-deere.json',
	ajaxLimit: 6

};

module.exports = AppConfig;
