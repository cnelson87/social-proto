/*
	TITLE: SocialWall

	DESCRIPTION: A social media wall aggregator widget.

	VERSION: 0.1.0

	USAGE: var socialwall = new SocialWall('Element', 'Options');
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- masonry.pkgd
		- imagesLoaded.phgd

*/

var AjaxGet					= require('utilities/AjaxGet');
var templateSocialItems 	= require('../../templates/social-items.hbs');

var SocialWall = function ($el, objOptions) {

	// defaults
	this.$el = $el;
	this.options = $.extend({
		dataUrl: null, // REQUIRED: path to json data
		dataLimit: 10,
		selectorLoadBtn: '.btn-load-more',
		selectorListEl: '.social-listing',
		selectorItems: '.grid-cell',
		selectorItemHdr: '> h3:first-child',
		classItemsLoading: 'loading'
	}, objOptions || {});

	// element references
	this.$btn = this.$el.find(this.options.selectorLoadBtn);
	this.$list = this.$el.find(this.options.selectorListEl);

	// Handlebars template
	this.template = templateSocialItems;

	// setup & properties
	this.dataLimit = this.options.dataLimit;
	this.dataUrl = this.options.dataUrl + '?limit=' + this.options.dataLimit;
	this.startId = null;
	this.userInteraction = false;
	this.facebookPostCount = 0;
	this.twitterPostCount = 0;
	this.instagramPostCount = 0;
	this.pinterestPostCount = 0;

	// init
	this._bindEvents();
	this.initMasonry();
	this.getContent();

};

SocialWall.prototype = {

	_bindEvents: function() {
		this.$btn.on('click', $.proxy(this.__onBtnClick, this));
	},

	_unbindEvents: function() {
		this.$btn.off('click');
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
			itemSelector: this.options.selectorItems
		});
	},

	getContent: function() {
		var dataUrl = this.dataUrl;
		if (this.startId) {
			dataUrl += '&start_id=' + this.startId;
		}

		$.when(AjaxGet(dataUrl, 'jsonp', true)).done(function(response) {
			//console.log(response);
			this.processData(response);
		}.bind(this)).fail(function() {
			alert('error with ajax call');
		}.bind(this));

	},

	processData: function(data) {
		// console.log('SocialWall:processData');

		for (var i = 0, len = data.length; i < len; i++) {

			// Facebook
			if (data[i].network === 'facebook') {
				this.facebookPostCount++;
				data[i].postNum = this.facebookPostCount;
				data[i].userName = data[i].from.name || null;
				data[i].pubDate = data[i].created_time ? new Date(data[i].created_time) : null;
				//data[i].postHref = 'https://www.facebook.com/' + data[i].facebook_id;
				data[i].postHref = 'https://www.facebook.com/' + data[i].facebook_id.split('_')[0] + '/posts/' + data[i].facebook_id.split('_')[1];
				data[i].contentText = data[i].message || null;
				data[i].imgSrc = data[i].picture || null;
				data[i].isVideo = (data[i].type === 'video');

				// Add anchors to content
				if (data[i].contentText) {
					data[i].contentText = this.replaceURL(  data[i].contentText );
					data[i].contentText = this.replaceHash( data[i].contentText, 'https://www.facebook.com/hashtag/' );
					data[i].contentText = this.replaceAt(   data[i].contentText, 'https://www.facebook.com/' );
				}

			}

			// Twitter
			if (data[i].network === 'twitter') {
				this.twitterPostCount++;
				data[i].postNum = this.twitterPostCount;
				data[i].userName = data[i].user.name || null;
				data[i].pubDate = data[i].user.created_at ? new Date(data[i].user.created_at) : null;
				data[i].postHref = 'https://twitter.com/' + data[i].user.screen_name + '/status/' + data[i].id_str;
				data[i].contentText = data[i].text || null;
				data[i].imgSrc = !!(data[i].entities.media && data[i].entities.media[0].media_url) ? data[i].entities.media[0].media_url : null;
				data[i].isVideo = (data[i].kind === 'video');

				// Add anchors to content
				if (data[i].contentText) {
					data[i].contentText = this.replaceURL(  data[i].contentText );
					data[i].contentText = this.replaceHash( data[i].contentText, 'https://twitter.com/search?q=%23' );
					data[i].contentText = this.replaceAt(   data[i].contentText, 'https://twitter.com/' );
				}

			}

			// Instagram
			if (data[i].network === 'instagram') {
				this.instagramPostCount++;
				data[i].postNum = this.instagramPostCount;
				data[i].userName = data[i].user.full_name || null;
				data[i].pubDate = data[i].caption.created_time ? new Date(parseInt(data[i].caption.created_time) * 1000) : null;
				data[i].postHref = data[i].link;
				data[i].contentText = data[i].caption.text || null;
				data[i].imgSrc = data[i].images.low_resolution.url || null;
				data[i].isVideo = (data[i].type === 'video');

				// Add anchors to content
				if (data[i].contentText) {
					data[i].contentText = this.replaceURL(  data[i].contentText );
					data[i].contentText = this.replaceHash( data[i].contentText, 'http://instagram.com/' );
					data[i].contentText = this.replaceAt(   data[i].contentText, 'http://instagram.com/' );
				}

			}

			// Pinterest
			if (data[i].network === 'rss') {
				data[i].network = 'pinterest';
				this.pinterestPostCount++;
				data[i].postNum = this.pinterestPostCount;
				data[i].userName = data[i].author || null;
				data[i].pubDate = data[i].pub_date ? new Date(data[i].pub_date) : null;
				data[i].postHref = data[i].link;
				data[i].contentText = $(data[i].description).text() || null;
				data[i].imgSrc = $(data[i].description).find('img').attr('src') || null;
				data[i].isVideo = (data[i].kind === 'video');

				// Add anchors to content
				if (data[i].contentText) {
					data[i].contentText = this.replaceURL(  data[i].contentText );
					data[i].contentText = this.replaceHash( data[i].contentText, 'https://www.pinterest.com/search/?q=' );
					data[i].contentText = this.replaceAt(   data[i].contentText, 'https://www.pinterest.com/' );
				}

			}

			// console.log(data[i]);

		}

		this.render(data);

	},

	/**
	 * function to replace text urls with anchor
	 * @param  {string} stringToParse - a string representing the string we want to replace
	 * @return {string} - a new string value with text replaced
	 */
	replaceURL: function(stringToParse) {
		var urlRegEx = /(https?:\/\/[^\s]+)/gi; 
		var newString = ' <a href="$1" target="_blank" title="opens in a new window">$1</a>';
		var result = stringToParse.replace(urlRegEx, newString);
		return result;
	},

	/**
	 * function to replace hashtags (#) with url
	 * @param  {string} stringToParse - a string representing the string we want to replace
	 * @return {string} - a new string value with text replaced
	 */
	replaceHash: function(stringToParse, baseURL) {
		var hashRegEx = /(^|\s)(#)([a-z\d_-][\w-]*)/gi; 
		var newString = ' <a href="' + baseURL + '$3" target="_blank" title="opens in a new window">$2$3</a>';
		var result = stringToParse.replace(hashRegEx, newString);
		return result;
	},

	/**
	 * function to replace at symbol (@) with url
	 * @param  {string} stringToParse - a string representing the string we want to replace
	 * @return {string} - a new string value with text replaced
	 */
	replaceAt: function(stringToParse, baseURL) {
		var hashRegEx = /(^|\s)(\@)([a-z\d_-][\w-]*)/gi;
		var newString = ' <a href="' + baseURL + '$3" target="_blank" title="opens in a new window">$2$3</a>';
		var result = stringToParse.replace(hashRegEx, newString);
		return result;
	},

	render: function(data) {
		// console.log('SocialWall:render');
		var html = this.template({items:data});
		var $items = $(html).filter(this.options.selectorItems);
		var $firstItem = $items.first();
		var items = $items.toArray();

		if (data.length === this.dataLimit) {
			this.startId = data[data.length-1].entity_id;
		} else {
			this._unbindEvents();
			this.$btn.remove();
		}

		this.$list.append(items).imagesLoaded(function() {
			$items.removeClass(this.options.classItemsLoading);
			this.$list.masonry('appended', items);
			if (this.userInteraction) {
				$firstItem.find(this.options.selectorItemHdr).focus();
			}
		}.bind(this));

	}

};

module.exports = SocialWall;
