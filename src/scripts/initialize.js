/**
 * initialize
 */

import 'babel-polyfill';

import handlebarsHelpers from 'config/handlebarsHelpers';
import Application from './Application.js';

document.addEventListener('DOMContentLoaded', function(event) {
	handlebarsHelpers();
	Application.initialize();
});
