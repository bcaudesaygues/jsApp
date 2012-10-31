define(["jQuery", "Store", "lib/model", "models/Flow", "views/Flow", "Router"], function($, Store, Model, Flow, FlowView, Router) {
	
	var FlowController = {
		list: function() {
			this.bind();
			var flowListView = FlowView.list;
			flowListView.render(Model.prototype.findAll(Flow));
		},
		show: function(id) {
			var flow = Model.prototype.findById(Flow, id);
			FlowView.show.render(flow);
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
		},
		unbind: function() {
		}
	};
    Router.controllers["FlowController"] = FlowController;
	return FlowController;
});