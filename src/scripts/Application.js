/**
 * Application
 * @author: Chris Nelson <cnelson87@gmail.com>
 */

import AppConfig from 'config/AppConfig';
import SocialWall from 'widgets/SocialWall';

const Application = {

	initialize: function() {
		//console.log('Application:initialize');

		this.$html = $('html');
		this.$body = $('body');

		if (AppConfig.isIE9) {this.$html.addClass('ie9');}
		if (AppConfig.isIE10) {this.$html.addClass('ie10');}
		if (AppConfig.isIE11) {this.$html.addClass('ie11');}
		if (AppConfig.isAndroid) {this.$html.addClass('android');}
		if (AppConfig.isIOS) {this.$html.addClass('ios');}

		new SocialWall($('#social-app'), {dataUrl: AppConfig.dataUrl, dataLimit: AppConfig.dataLimit});

	}

};

window.Application = Application;

export default Application;
