$(document).ready(function() {
	var App = {
		conf: {
			mode: "dev"
		}
	}

	/*******************************
	* Old browser
	*******************************/
    if (!Array.prototype.filter)
    {
      Array.prototype.filter = function(fun /*, thisp */)
      {
        "use strict";
     
        if (this == null)
          throw new TypeError();
     
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != "function")
          throw new TypeError();
     
        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
          if (i in t)
          {
            var val = t[i]; // in case fun mutates this
            if (fun.call(thisp, val, i, t))
              res.push(val);
          }
        }
     
        return res;
      };
    }

	Object.defineGetterAndSetter = function(obj, property, getterAndSetter) {
		obj["get_"+property] = getterAndSetter.get;
		obj["set_"+property] = getterAndSetter.set;
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

    function Model() {};
    Model.prototype.save =  function() {
        window.store.save(this);
    };
    Model.prototype.findAll = function(modelType) {
        return window.store.all(modelType);
    };
    Model.prototype.update = function() {
    };
    Model.prototype.destroy = function() {
    };
    Model.prototype.find = function(param) {
        window.store.find(this.constructor, param);
    };
    Model.prototype.findByIds = function(modelType, ids) {
		return window.store.findIds(modelType, ids);
	};
    Model.prototype.findById = function(modelType, id) {
		return window.store.find(modelType, id);
	};
	
	/****************
	*	Models
	****************/

	// --- Process
	// --- Company


	// --- User


	function Task() {
		this.__meta = [
			"id",
			"name",
			"status",
			"alertMessage",
			"actor",
			"isEditable"
		]

		Object.defineGetterAndSetter(this, "actor", {
			get: function() {
				return Model.prototype.findById(User, this.actor)
			},
			set: function(actorId) {
				this.actor = actorId;
			}
		})
	}
	Task.prototype = new Model;
	Task.prototype.constructor = "Task";

	/****************
	*	Controllers
	****************/
	var FlowController = {
		list: function() {
            flowListView.render(Model.prototype.findAll(Flow));
		},
		show: function(id) {
			var flow = Model.prototype.findById(Flow, id);
			flowDetailView.render(flow);
		},
		save: function(flow, callback) {
			// Property merge
			if (flow.id) {
				var f = Model.prototype.findById(Flow, flow.id);
				var flow = $.extend(f, true, flow);
			// Not in the store
			} else {
				flow = window.store.factory(Flow, flow);
			}
            
			flow.save();

			if (callback)
				callback();
		},
		addFlowForm: function() {
			var flow = window.store.factory(Flow, {})
			flowDetailView.render(flow);
		}
	};

	var StepController = {
		show: function(id) {
			var step = Model.prototype.findById(Step, id);
			stepDetailView.render(step);
		}
	};


	/****************
	* 	Views
	****************/
	var flowListView = {
		render: function(flows) {
			if (!flows) {
				flows = Model.prototype.findAll(Flow);
			}
			if (!flows) {
				return;
			}
			var html = Mustache.render($("#flow-list-template").html(), {"flows": flows});
			$("#app #flow-list").html(html);

			this.bind();
		},
		bind: function() {
			// Display flow form
			$("#app").on("click.FlowList", "dt", function(e) {
				e.preventDefault();
				var id = $(this).find("input[name='id']").val();
				FlowController.show(id);
			});

			// Display new flow form
			$("#app").on("click.addFlow", "a.add-flow", function(e) {
				e.preventDefault();
				FlowController.addFlowForm();
			});

			// Save flow
			$(document).on("Flow.save", function(e) {
				flowListView.destroy();
				flowListView.render();
			});

			// Display step
			$("#app").on("click.showStep", "dd .flow-step", function(e) {
				Console.log("Show step detail");
				e.preventDefault();
				var id = $(this).find("input[name='id']").val();
				StepController.show(id);
			});
		},
		unbind: function() {
			$("#app").unbind("click.FlowList");
			$("#app").unbind("click.addFlow");
			$(document).unbind("Flow.save.flowlist");
			$("#app").unbind("click.showStep");
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
			var html = Mustache.render($("#flow-detail-template").html(), {"flow": flow});
			$("#flow-detail").html(html);
			this.bind();
			$("#flow-detail").removeClass("display-none");
		},
		save: function(event) {
			event.preventDefault();
			var flow = bindFormToObj($("#app #flow-detail form"));
			FlowController.save(flow, flowDetailView.close);
		},
		bind: function() {
			// Remove all previous event handler
			this.unbind();

			// Close popup
			$("#flow-detail").on("click.Flow", ".close", flowDetailView.close);

			// Save change
			$("#flow-detail").on("submit.Flow", "form", this.save);
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

	var stepDetailView = {
		render: function(step) {
			if (!step) {
				return;
			}
			var html = Mustache.render($("#step-detail-template").html(), {"step": step});
			$("#step-detail").html(html);
			this.bind();
			$("#step-detail").removeClass("display-none");
		},
		bind: function() {
			// Remove all previous event handler
			this.unbind();

			// Close popup
			$("#step-detail").on("click.Step", ".close", stepDetailView.close);
		},
		unbind: function() {
			$("#step-detail").unbind("click.Step");
		},
		close: function() {
			$("#step-detail").addClass("display-none");
			stepDetailView.unbind();
			$("#step-detail").html("");
		}
	};
    
    if (document.addEventListener) {
        document.addEventListener("storage", event_storage, false);
        document.addEventListener("storagecommit", event_storage, false);
    } else {
        document.attachEvent("onstorage", window.store.storeEvent);
        document.attachEvent("onstoragecommit", window.store.storeEvent);
    };

	window.store.insert(Company, companies);
	window.store.insert(Process, processes);
	window.store.insert(User, users);
	window.store.insert(Task, tasks);
	window.store.insert(Step, steps);
	window.store.insert(Flow, flows);

	FlowController.list();
});