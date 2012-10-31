define(["jQuery"], function() {
	
	// DOM form to object binding
	window.bindFormToObj = function(formNode, obj) {
		var formObj = {};
		$(formNode).find("input[name]").each(function(key, input) {
			formObj[$(input).attr("name")] = $(this).val();
		});
		return formObj;
	};
});