
var Handlebars = require('handlebars/runtime')['default'];

const handlebarsHelpers = function(){
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
	Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {

		var operators, result;

		if (arguments.length < 3) {
			throw new Error("Handlebars Helper 'compare' needs 2 parameters");
		}

		if (options === undefined) {
			options = rvalue;
			rvalue = operator;
			operator = "===";
		}

		operators = {
			'==': function (l, r) { return l == r; },
			'===': function (l, r) { return l === r; },
			'!=': function (l, r) { return l != r; },
			'!==': function (l, r) { return l !== r; },
			'<': function (l, r) { return l < r; },
			'>': function (l, r) { return l > r; },
			'<=': function (l, r) { return l <= r; },
			'>=': function (l, r) { return l >= r; },
			'typeof': function (l, r) { return typeof l == r; }
		};

		if (!operators[operator]) {
			throw new Error("Handlebars Helper 'compare' doesn't know the operator " + operator);
		}

		result = operators[operator](lvalue, rvalue);

		if (result) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}

	});

/* jshint ignore:end */
};

export default handlebarsHelpers;
