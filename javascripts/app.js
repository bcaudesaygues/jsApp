$(document).ready(function() {
	var App = {
		conf: {
			mode: "dev"
		}
	}

	/*******************************
	* LIB JS
	*******************************/
	var Console =  {
		log: function(msg) {
			if (App.conf.mode == "dev" && window.console)
				console.log(msg);
		}
	};

    // DOM form to object binding
	var bindFormToObj = function(formNode, obj) {
		var formObj = {};
		$(formNode).find("input[name]").each(function(key, input) {
			formObj[$(input).attr("name")] = $(this).val();
		});
		return $.extend(obj, true, formObj);
	};

    // Object factory
    var factory = function(modelType, arg) {
//        var properties = {};
//        $.each(arg, function(key, value) {
//            properties[key] = {value: value};
//        });
//        return Object.create(modelType.prototype, properties)
        var obj = new modelType;
        $.each(obj.__meta, function(index, propName) {
            if (arg[propName]) {
                obj[propName] = arg[propName];
            } else {
                obj[propName] = "";
            }
        });

        obj.prototype = new modelType;
        return obj;
    };

    function Model() {};
    Model.prototype.save=  function() {
        Console.log("saving model");
    };
    Model.prototype.update = function() {
        Console.log("updating model");
    };
    Model.prototype.destroy = function() {
        Console.log("delete model");
    };
    Model.prototype.find = function(param) {
        Console.log("looking for model with param" + param );
    };
	Console.log("Loading application");

	/****************
	*	Models
	****************/
    function Flow() {
        this.__meta = [
            "name",
            "company",
            "process",
            "owner",
            "startDate",
            "endDate"
        ]
    };
    Flow.prototype = new Model;

	Flow.prototype.save = function() {
			Console.log("Saving Flow and launching event");
			$(document).triggerHandler("Flow.save", this);
	};

	var FlowList = {
		flows: [],
		loadFlows: function(rawFlows) {
            var length = rawFlows.length;
            for (i = 0; i < length; i++) {
                var f = factory(Flow, rawFlows[i]);
                FlowList.flows.push(f);
            }
		},

        getFlows: function() {
            return this.flows;
        },

		getFlowByName: function(name) {
			var flowsLength = this.flows.length;
			var flow = null;
			for (i = 0; i<flowsLength; i++) {
				var f = this.flows[i];
				if (f.name == name) {
					flow = f;
					break;
				}
			}
			return flow;
		}
	};

	/****************
	*	Controllers
	****************/
	var FlowController = {
		list: function() {
			flowListView.render(FlowList.getFlows());
		},
		show: function(name) {
			var flow = FlowList.getFlowByName(name);
			flowDetailView.render(flow);
		},
		save: function(flow, callback) {
			Console.log("Asking the flow to save himself ");
			Console.log(flow);
			var f = FlowList.getFlowByName(flow.name)
			// Validation
			if (f) {
				var flow = $.extend(f, true, flow);
			} else {

			}
			flow.save();

			if (callback)
				callback();
		}
	};


	/****************
	* 	Views
	****************/
	var flowListView = {
		render: function(flows) {
			if (!flows) {
				Console.log("flows is undefined");
				var flows = FlowList.getFlows();
			}
			var html = ["<ul>"];
			var flowsLength = flows.length;
			for (i = 0; i<flowsLength; i++) {
				var flow = flows[i];
				html.push("<li>");
				html.push("<span class='id'>" + flow.name + "</span>");
				html.push("</li>");
			}
			html.push("</ul>");
			$("#app").html(html.join(""));

			this.bind();
		},
		bind: function() {
			$("#app").on("click.FlowList", "ul li", function(e) {
				e.preventDefault();
				var name = $(this).find(".id").html();
				FlowController.show(name);
			});

			$(document).on("Flow.save", function(e) {
				Console.log("Flow list updated, rerender the view");
				flowListView.destroy();
				flowListView.render();
			});
		},
		unbind: function() {
			$("#app").unbind("click.FlowList");
			$(document).unbind("Flow.save");
		},
		destroy: function() {
			this.unbind();
		}
	};

	var flowDetailView = {
		render: function(flow) {
			var html = "<div class='modal' id='flow-detail'><div class='title'>" + flow.name + "<a class='close'>X</a></div><div class='detail'>" + 
					"<input type='hidden' name='name' value='" + flow.name + "'><br/>" +
					"<label>Company:</label><input type='text' name='company' value='" + flow.company + "'><br/>" +
					"<label>Process:</label><input type='text' name='process' value='" + flow.process + "'><br/>" +
					"<label>Owner:</label><input type='text' name='owner' value='" + flow.owner + "'><br/>" +
					"<label>startDate:</label><input type='text' name='startDate' value='" + flow.startDate + "'><br/>" +
					"<label>endDate:</label><input type='text' name='startDate' value='" + flow.endDate + "'><br/>" +
				"</div><button class='submit'>Enregistrer</button></div>";
			if ($("#app #flow-detail").length > 0) {
				$("#app #flow-detail").html(html);
			} else {
				$("#app").append(html);
			}
			this.bind();
		},
		bind: function() {
			// Close popup
			$("#app").on("click.Flow", "#flow-detail .close", flowDetailView.close);

			// Save change
			$("#app").on("click.Flow", "#flow-detail .submit", function(e) {
				var flow = bindFormToObj($("#app #flow-detail .detail"));
				Console.log(e);
				flowDetailView.close();
				FlowController.save(flow);
			});
		},
		unbind: function() {
			Console.log("unbinding event attached to flow detail view");
			$("#app").unbind("click.Flow");
		},
		close: function() {
			Console.log("close flow detail view");
			$("#app #flow-detail").remove();
			flowDetailView.unbind();
		}
	}
	Console.log("Application loaded");

	// Sample data
	var flows =  [
		{
			name: "flow1",
			company: "company1",
			process: "process1",
			owner: "nmedda",
			startDate: "01/01/2001",
			endDate: "01/02/2001",
			id: 1
		},
		{
			name: "flow2",
			company: "company2",
			process: "process1",
			owner: "nmedda",
			startDate: "01/01/2001",
			endDate: "01/02/2001",
			id: 2
		},
	];
	FlowList.loadFlows(flows);

	FlowController.list();

	Console.log("launching application");
});