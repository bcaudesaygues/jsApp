(function($) {
	var sexyCreate = function(event, ui) {
		var input = $(this);
		var searchTrigger = getOrCreateSearchTrigger(input);
		
		searchTrigger.click(function() {
			if (input.not(":disabled")) {
				// close if already visible
				if ( input.sexyAutocomplete( "widget" ).is( ":visible" ) ) {
					input.sexyAutocomplete( "close" );
					return;
				}

				// work around a bug (likely same cause as #5265)
				$( this ).blur();

				// pass empty string as value to search for, displaying all results
				input.sexyAutocomplete("search", "");
				input.focus();
			}
		});
	}

	var getOrCreateSearchTrigger = function (input) {
		var searchTrigger = input.next("span.add-on");
		if (! searchTrigger.length) {
			searchTrigger = $('<span class="add-on"></span>');
			searchTrigger.insertAfter(input);
			input.parents(".clearfix").first().addClass("input-append");
		}
		return searchTrigger;
	}

	$.widget ('ui.sexyAutocomplete', $.ui.autocomplete, {

		options: {
			minLength: 0,
			create: sexyCreate
		}
	});

})(jQuery);


