define(["Router", "lib/model", "models/Step", "models/Flow", "views/Step"], function(Router, Model, Step, Flow, StepView) {
    var StepController = {
        show: function(id) {
    		var step = Step.prototype.findById(id);
    		StepView.show.render(step);
    	},
        save: function(stepForm, callback) {
            // Property merge
            var step;
            if (stepForm.id) {
                step = Step.prototype.findById(stepForm.id);
                _.each(stepForm, function(value, property) {
                    if (step["set_" + property]) {
                        step["set_" + property](value);
                    } else if (step[property]) {
                        step[property] = value;
                    }
                });
                // Not in the store
            } else {
                step = Store.factory(Step.prototype, stepForm);
            }

            step.save();
            
            if (!stepForm.id) {
                var flow = Flow.prototype.findById(stepForm.flow);
                flow.addStep(step);
            }

            if (callback)
                callback();

            Router.route("StepController", "show", step.id);
        },
        add: function(flowId) {
            var step = Store.factory(Step.prototype, {});
            StepView.create.render(step, flowId);
        }
    };
    
    Router.controllers["StepController"] = StepController;
    return StepController;
});