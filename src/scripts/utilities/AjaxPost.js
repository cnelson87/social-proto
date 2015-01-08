/**
 *	returns an Ajax POST response using deferred, url & data are required, dataType & crossDomain are optional.
 *  @return: json, html, text
 */

var AjaxPost = function(url, data, dataType, crossDomain) {
	return $.ajax({
		type: 'POST',
		url: url,
		data: data,
		dataType: dataType || 'json',
		crossDomain: crossDomain || false
	});
};

module.exports = AjaxPost;
