define(["jQuery", "Store", "lib/model", "models/Flow", "views/Flow"], function($, Store, Model, Flow, FlowView) {
    
    var FlowController = {
		list: function() {
            this.bind();
            console.log("flow controller list");
            var flowListView = FlowView.list;
            flowListView.render(Model.prototype.findAll(Flow));
		},
		show: function(id) {
			var flow = Model.prototype.findById(Flow, id);
            var flowDetailView = FlowView.show;
			flowDetailView.render(flow);
		},
		save: function(flowForm, callback) {
			// Property merge
            var flow;
			if (flowForm.id) {
				flow = Model.prototype.findById(Flow, flowForm.id);
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
		},
		addFlowForm: function() {
			var flow = Store.factory(Flow, {})
            var flowDetailView = FlowView.show;
			flowDetailView.render(flow);
		},
        bind: function() {
            $(document).on("Flow.save.list", function() {
                FlowController.list();
            });
        },
        unbind: function() {
            $(document).unbind("Flow.save.list");
        }
	};
    window.FlowController = FlowController;
});