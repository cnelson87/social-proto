/**
 * Application Module
 * 
 * @author Chris Nelson
 */

var AppConfig				= require('config/AppConfig');
var AjaxGet					= require('utilities/AjaxGet');
var templateSocialItems 	= require('../templates/social-items.hbs');


var Application = {

	initialize: function() {
		//console.log('Application:initialize');

		this.$el = $('#social-app');
		this.$list = this.$el.find('.social-listing');
		this.$btn = this.$el.find('.btn-load-more');

		if (AppConfig.isIE9) {this.$html.addClass('ie9');}

		this.template = templateSocialItems;

		this.ajaxUrl = AppConfig.ajaxUrl + '?limit=' + AppConfig.ajaxLimit;// + '&network=facebook';

		this.startId = null;

		this.userInteraction = false;

		this.bindEvents();

		this.initMasonry();

		this.getContent();

	},

	bindEvents: function() {
		this.$btn.on('click', $.proxy(this.__onBtnClick, this));
	},

	__onBtnClick: function(event) {
		event.preventDefault();
		this.userInteraction = true;
		this.getContent();
	},

	initMasonry: function() {
		this.$list.masonry({
			columnWidth: 300,
			gutter: 20,
			itemSelector: '.grid-cell'
		});
	},

	getContent: function() {
		var ajaxUrl = this.ajaxUrl;
		if (this.startId) {
			ajaxUrl += '&start_id=' + this.startId;
		}

		$.when(AjaxGet(ajaxUrl, 'jsonp', true)).done(function(response) {
			//console.log(response);
			this.processData(response);
		}.bind(this)).fail(function() {
			alert('error with ajax call');
		}.bind(this));

	},

	processData: function(data) {

		for (var i = 0, len = data.length; i < len; i++) {

			// Facebook
			if (data[i].network === 'facebook') {
				data[i].userName = data[i].from.name;
				data[i].postHref = 'https://www.facebook.com/' + data[i].facebook_id;
				data[i].contentText = data[i].message;
				data[i].imgSrc = data[i].picture || null;
			}

			// Twitter
			if (data[i].network === 'twitter') {
				data[i].userName = data[i].user.name;
				data[i].postHref = 'https://twitter.com/' + data[i].user.screen_name + '/status/' + data[i].id_str;
				data[i].contentText = data[i].text;
				data[i].imgSrc = !!(data[i].entities.media && data[i].entities.media[0].media_url) ? data[i].entities.media[0].media_url : null;
			}

			// Instagram
			if (data[i].network === 'instagram') {
				data[i].userName = data[i].user.full_name;
				data[i].postHref = data[i].link;
				data[i].contentText = data[i].caption.text;
				data[i].imgSrc = data[i].images.low_resolution.url || null;
			}

			// Pinterest
			if (data[i].network === 'rss') {
				data[i].network = 'pinterest';
				data[i].userName = data[i].author;
				data[i].postHref = data[i].link;
				data[i].contentText = $(data[i].description).text();
				data[i].imgSrc = $(data[i].description).find('img').attr('src') || null;
			}

		}

		this.render(data);

	},

	render: function(data) {
		//console.log('Application:render');
		var html = this.template({items:data});
		var $items = $(html).filter('.grid-cell');
		var $firstItem = $items.first();
		var items = $items.toArray();

		if (data.length === AppConfig.ajaxLimit) {
			this.startId = data[data.length-1].entity_id;
		} else {
			this.$btn.remove();
		}

		this.$list.append(items).imagesLoaded(function() {
			$items.removeClass('loading');
			this.$list.masonry('appended', items);
			if (this.userInteraction) {
				$firstItem.find('> h3:first-child').focus();
			}
		}.bind(this));

	}

};

module.exports = Application;
