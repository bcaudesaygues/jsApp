define(["Router", "lib/model", "models/Step", "views/Step"], function(Router, Model, Step, StepView) {
    var StepController = {};
    StepController.show = Router.action(StepController, function(id) {
        var step = Step.prototype.findById(id);
        StepView.show.render(step);
    }, '/steps/:id');
    StepController.save = function(stepForm, callback) {
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
            step = Store.factory(Step.prototype, step);
        }

        step.save();
        
        if (!stepForm.id) {
            var flow = Flow.prototype.findById(stepForm.flow);
            flow.addStep(step);
        }

        if (callback)
            callback();

        Router.controllers.StepController.show(step.id);
    };
	StepController.add = function(flowId) {
        var step = Store.factory(Step.prototype, {});
        StepView.create.render(step, flowId);
    };
    
    Router.controllers.StepController = StepController;
    return StepController;
});