/**
 * Application Config
 */

if (!window.location.origin) {
	window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

var AppConfig = {

	siteUrl: window.location.origin,
	isIE9: navigator.userAgent.indexOf('MSIE 9') !== -1,
	hasFormValidation: typeof document.createElement('input').checkValidity === 'function',
	hasTouch: Modernizr.touch,

	dataUrl: 'https://api.massrelevance.com/DummyTGT/abv-homepage.json',
	dataLimit: 6

};

module.exports = AppConfig;
