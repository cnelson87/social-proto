/**
 * Application Module
 * 
 * @author Chris Nelson
 */

var AppConfig				= require('config/AppConfig');
var SocialWall				= require('widgets/SocialWall');
// var templateSocialItems 	= require('templates/social-items.hbs');


var Application = {

	initialize: function() {
		//console.log('Application:initialize');

		this.$html = $('html');
		this.$body = $('body');

		if (AppConfig.isIE9) {this.$html.addClass('ie9');}

		new SocialWall($('#social-app'), {dataUrl: AppConfig.dataUrl, dataLimit: AppConfig.dataLimit});

	}

};

module.exports = Application;
