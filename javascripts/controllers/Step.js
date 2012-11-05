define(["Router", "lib/model", "models/Step", "views/Step"], function(Router, Model, Step, StepView) {
    var StepController = {
        show: function(id) {
    		var step = Model.prototype.findById(Step, id);
    		StepView.show.render(step);
    	},
        save: function(stepForm, callback) {
            // Property merge
            var step;
            if (stepForm.id) {
                step = Model.prototype.findById(Step, stepForm.id);
                _.each(stepForm, function(value, property) {
                    if (step["set_" + property]) {
                        step["set_" + property](value);
                    } else if (step[property]) {
                        step[property] = value;
                    }
                });
                // Not in the store
            } else {
                step = Store.factory(Step, step);
            }

            step.save();

            if (callback)
                callback();

            Router.route("StepController", "show", step.id);
        }
    };
    
    Router.controllers["StepController"] = StepController;
    return StepController;
});