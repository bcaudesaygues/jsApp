define(["jQuery", 'Underscore', "Store", "lib/model", "models/Flow", "views/Flow", "Router"], function($, _, Store, Model, Flow, FlowView, Router) {
	
	var FlowController = {
		list: function() {
			FlowController.bind();
			var flowListView = FlowView.list;
			flowListView.render(Flow.prototype.findAll());
		},
		show: function(id) {
			var flow = Flow.prototype.findById(id);
			FlowView.show.render(flow);
		},
		save: function(flowForm, callback) {
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
				flow = Store.factory(Flow, flow);
			}
			
			flow.save();

			if (callback)
				callback();

			Router.route("FlowController", "list");
		},
		addFlowForm: function() {
			var flow = Store.factory(Flow, {});
			var flowDetailView = FlowView.show;
			flowDetailView.render(flow);
		},
        closeShow: function() {
            FlowView.show.close();  
        },
		bind: function() {
            this.unbind();
            
            // Refresh list if: 
            // Flow is updated
            $(document).on("Flow.save.flowcontroller", FlowController.list);
            // Step is updated
            $(document).on("Step.save.flowcontroller", FlowController.list);
		},
		unbind: function() {
            $(document).unbind("Flow.save.flowcontroller");
            $(document).unbind("Step.save.flowcontroller");
		}
	};
    Router.controllers["FlowController"] = FlowController;
	return FlowController;
});