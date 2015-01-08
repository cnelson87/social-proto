/**
 * Application Module
 * 
 * @author Chris Nelson
 */

var AppConfig				= require('config/AppConfig');
var AppEvents				= require('events/AppEvents');
var PubSub					= require('utilities/PubSub');
var AjaxGet					= require('utilities/AjaxGet');
var BreakpointChange		= require('utilities/BreakpointChange');
var templateSocialItems 	= require('../templates/social-items.hbs');


var Application = {

	initialize: function() {
		//console.log('Application:initialize');

		// this.$window = $(window);
		// this.$document = $(document);
		// this.$html = $('html');
		// this.$body = $('body');
		this.$el = $('#social-app');
		this.$list = this.$el.find('.social-listing');
		this.$btn = this.$el.find('.btn-load-more');

		if (AppConfig.isIE9) {this.$html.addClass('ie9');}

		this.template = templateSocialItems;

		//this.ajaxUrl = '/_api/social-items.json';
		this.ajaxUrl = AppConfig.ajaxUrl + '?limit=' + AppConfig.ajaxLimit;// + '&network=facebook';
		//this.ajaxUrl = 'http://api.massrelevance.com/ill_adelphia/john-deere.json?limit=6';

		this.startId = null;

		this.userInteraction = false;

		//BreakpointChange();

		this.bindEvents();

		this.initMasonry();

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
			this.render(response);
		}.bind(this)).fail(function() {
			alert('error with ajax call');
		}.bind(this));

	},

	bindEvents: function() {
		// PubSub.on(AppEvents.BREAKPOINT_CHANGE, this.onBreakpointChange, this);
		this.$btn.on('click', $.proxy(this.__onBtnClick, this));
	},

	__onBtnClick: function(event) {
		event.preventDefault();
		this.userInteraction = true;
		this.getContent();
	},

	// onBreakpointChange: function(params) {
	// 	console.log('onBreakpointChange',params);
	// 	this.$window.trigger('breakpointChange', [params]);
	// },

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
			this.$list.masonry('appended', items);
			if (this.userInteraction) {
				$firstItem.find('> h3:first-child').focus();
			}
		}.bind(this));

	}

};

module.exports = Application;
