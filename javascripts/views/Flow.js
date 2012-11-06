define(["Template", "Router", "lib/view", "controllers/Step"], function(Template, Router) {
	
	var flowListView = {
        render: function(flows) {
    		if (!flows) {
				return;
			}
			var html = Template.render($("#flow-list-template").html(), {"flows": flows});
			$("#flow-list").html(html);
	
			flowListView.bind();
		},
        bind: function() {
    		// Display flow form
			$("#flow-list").on("click.FlowList", "dt .edit", function(e) {
				e.preventDefault();
				var id = $(this).find("input[name='id']").val();
			    Router.route("FlowController", "show", id);
			});
	
			// Display new flow form
			$("#flow-list").on("click.addFlow", "a.add-flow", function(e) {
				e.preventDefault();
				Router.route("FlowController","addFlowForm");
			});
		
			// Display step
			$("#flow-list").on("click.showStep", "dd .flow-step", function(e) {
				e.preventDefault();
				var id = $(this).find("input[name='id']").val();
				Router.route("StepController", "show", id);
			});
            
            $("#flow-list").on("click.addStep", "dt .add-step", function(e) {
                e.preventDefault();
                var flowId = $(this).parents("dt").find("input[name='id']").val();
                Router.route("StepController", "add", flowId);
            });
		},
		unbind: function() {
			$("#flow-list").unbind("click.FlowList");
			$("#flow-list").unbind("click.addFlow");
			$("#flow-list").unbind("click.showStep");
            $("#flow-list").unbind("click.addStep");
		},
		destroy: function() {
			this.unbind();
		}
	};
	
	var flowDetailView = {
		render: function(flow) {
			if (!flow) {
				return;
			}
            var template = $("#flow-detail-template").html();
			var html = Template.render(template, {"flow": flow});
			$("#flow-detail").html(html);
			this.bind();
			$("#flow-detail").removeClass("display-none");
		},
		save: function(event) {
			event.preventDefault();
			var flow = bindFormToObj($("#flow-detail form"));
			Router.route("FlowController","save", flow);
            flowDetailView.close();
		},
		bind: function() {
			// Remove all previous event handler
			this.unbind();
	
			// Close popup
			$("#flow-detail").on("click.Flow", ".close", flowDetailView.close);
	
			// Save change
			$("#flow-detail").on("submit.Flow", "form", flowDetailView.save);
		},
		unbind: function() {
			$("#flow-detail").unbind("click.Flow");
			$("#flow-detail").unbind("submit.Flow");
		},
		close: function() {
			$("#flow-detail").addClass("display-none");
			flowDetailView.unbind();
			$("#flow-detail").html("");
		}
	};
    
	return {
		"list": flowListView,
		"show": flowDetailView
	};
});