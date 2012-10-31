define(["Router", "lib/model", "models/Step", "views/Step"], function(Router, Model, Step, StepView) {
    var StepController = {
        show: function(id) {
    		var step = Model.prototype.findById(Step, id);
    		StepView.show.render(step);
    	}
    };
    
    Router.controllers["StepController"] = StepController;
    return StepController;
});