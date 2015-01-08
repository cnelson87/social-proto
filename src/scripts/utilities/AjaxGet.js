/**
 *	returns an Ajax GET request using deferred, url is required, dataType & crossDomain are optional.
 *  @return: json, html, text
 */

var AjaxGet = function(url, dataType, crossDomain) {
	return $.ajax({
		type: 'GET',
		url: url,
		dataType: dataType || 'json',
		crossDomain: crossDomain || false
	});
};

module.exports = AjaxGet;
