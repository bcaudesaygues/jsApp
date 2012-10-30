// DOM form to object binding
var bindFormToObj = function(formNode, obj) {
	var formObj = {};
	$(formNode).find("input[name]").each(function(key, input) {
		formObj[$(input).attr("name")] = $(this).val();
	});
	return $.extend(obj, true, formObj);
};