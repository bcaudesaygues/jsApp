var StepController = {
	show: function(id) {
		var step = Model.prototype.findById(Step, id);
		stepDetailView.render(step);
	}
};
