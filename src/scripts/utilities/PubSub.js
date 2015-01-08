/**
 * Global PubSub object for dispatch and delegation
 */

var PubSub = {};

_.extend( PubSub, Backbone.Events );

module.exports = PubSub;
