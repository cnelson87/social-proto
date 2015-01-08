
var Handlebars = require('handlebars/runtime')['default'];

var HandlebarsHelpers = function(){
/* jshint ignore:start */

	/**
	 * Replace \n with br tags
	 * @return {[type]} [description]
	 */
	Handlebars.registerHelper('breaklines', function(text) {
		text = Handlebars.Utils.escapeExpression(text);
		text = text.replace(/(\r\n|\n|\r)/gm, '<br />');
		return new Handlebars.SafeString(text);
	});

	/**
	 * Compare a value
	 * @return {[type]} [description]
	 */
	Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

		if (arguments.length < 3) {
			throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
		}

		operator = options.hash.operator || "==";

		var operators = {
			'==':       function(l,r) { return l == r; },
			'===':      function(l,r) { return l === r; },
			'!=':       function(l,r) { return l != r; },
			'<':        function(l,r) { return l < r; },
			'>':        function(l,r) { return l > r; },
			'<=':       function(l,r) { return l <= r; },
			'>=':       function(l,r) { return l >= r; },
			'typeof':   function(l,r) { return typeof l == r; }
		}

		if (!operators[operator]) {
			throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
		}

		var result = operators[operator](lvalue,rvalue);

		if (result) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}

	});

/* jshint ignore:end */
};

module.exports = HandlebarsHelpers;
