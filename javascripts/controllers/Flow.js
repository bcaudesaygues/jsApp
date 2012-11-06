define(["jQuery", 'Underscore', "Store", "lib/model", "models/Flow", "views/Flow", "Router"], function($, _, Store, Model, Flow, FlowView, Router) {
	
	
    var FlowController = {};
    FlowController.list = Router.action(FlowController, function() {
        FlowController.bind();
        FlowView.list.render(Flow.prototype.findAll());
    }, '');
    FlowController.show = Router.action(FlowController, function(id) {
        var flow = Flow.prototype.findById(id);
        FlowView.show.render(flow);
    }, '/flow/:id');
    FlowController.save = function(flowForm, callback) {
        // Property merge
        var flow;
        if (flowForm.id) {
            flow = Flow.prototype.findById(flowForm.id);
            _.each(flowForm, function(value, property) {
                if (flow["set_" + property]) {
                    flow["set_" + property](value);
                } else if (flow[property]) {
                    flow[property] = value;
                }
            });
        // Not in the store
        } else {
            flow = Store.factory(Flow.prototype, flow);
        }

        flow.save();

        if (callback)
            callback();

        FlowController.list();
    };
    FlowController.addFlowForm = Router.action(FlowController, function() {
        var flow = Store.factory(Flow, {});
        FlowView.show.render(flow);
    }, '/flow/new');
    FlowController.closeShow = function() {
        FlowView.show.close();
    };
    FlowController.bind = function() {
        this.unbind();
        
        // Refresh list if: 
        // Flow is updated
        $(document).on("Flow.save.flowcontroller", FlowController.list);
        // Step is updated
        $(document).on("Step.save.flowcontroller", FlowController.list);
    };
    FlowController.unbind = function() {
        $(document).unbind("Flow.save.flowcontroller");
        $(document).unbind("Step.save.flowcontroller");
    };
    Router.controllers.FlowController = FlowController;
    return FlowController;
});