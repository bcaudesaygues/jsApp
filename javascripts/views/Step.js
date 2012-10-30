var stepDetailView = {
	render: function(step) {
		if (!step) {
			return;
		}
		var html = Mustache.render($("#step-detail-template").html(), {"step": step});
		$("#step-detail").html(html);
		this.bind();
		$("#step-detail").removeClass("display-none");
	},
	bind: function() {
		// Remove all previous event handler
		this.unbind();

		// Close popup
		$("#step-detail").on("click.Step", ".close", stepDetailView.close);
	},
	unbind: function() {
		$("#step-detail").unbind("click.Step");
	},
	close: function() {
		$("#step-detail").addClass("display-none");
		stepDetailView.unbind();
		$("#step-detail").html("");
	}
};
