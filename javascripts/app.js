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
	// --- Flow
	function Flow() {
	    this.__meta = [
	    	"id",
	        "label",
	        "company",
	        "process",
	        "owner",
	        "startDate",
	        "endDate",
	        "steps"
	    ]

	    // Process getter/setter
	    Object.defineGetterAndSetter(this, "process", {
	    	get: function() {
	    		return Model.prototype.findById(Process, this.process);
    		},
    		set: function(processId) {
	    		this.process = processId;
	    	}
    	});
	   
	    // Company getter/setter
	    Object.defineGetterAndSetter(this, "company", {
	    	get: function() {
		    	return Model.prototype.findById(Company, this.company);
		    },
		    set: function(companyId) {
		    	this.company = companyId;
		    }
	    });

	    // Owner getter/setter
	    Object.defineGetterAndSetter(this, "owner", {
	    	get: function() {
		    	return Model.prototype.findById(User, this.owner);
		    },
		    set: function(ownerId) {
		    	this.owner = ownerId;
		    }
	    });

	    // Company getter/setter
	    Object.defineGetterAndSetter(this, "steps", {
	    	get: function() {
		    	var steps = Model.prototype.findByIds(Step, this.steps);
		    	_.each(steps, function(step, index) {
		    		step.flow = this;
		    	});
		    	return steps
		    },
		    set: function(stepsId) {
		    	this.steps = stepsId;
		    }
	    });
	    
	};
	Flow.prototype = new Model;
	Flow.prototype.constructor = "Flow";

	Flow.prototype.save = function() {
		Console.log("Saving Flow and launching event");
		window.store.save(this);
		$(document).triggerHandler("Flow.save", this);
	};
	Flow.prototype.findByName = function(name) {
		return window.store.find(this.constructor, function(item, index, val) {
			return item.name == name;
		})[0];
	};

	// --- Process
	function Process() {
		this.__meta = [
			"id",
			"name"
		]
	};
	Process.prototype = new Model;
	Process.prototype.constructor = "Process";

	// --- Company
	function Company() {
		this.__meta = [
			"id",
			"value",
			"name",
			"code"
		]
	};
	Company.prototype = new Model;
	Company.prototype.constructor = "Company";

	// --- User
	function User() {
		this.__meta = [
			"id",
			"name",
			"isAccountActive"
		]
	}
	User.prototype = new Model;
	User.prototype.constructor = "User";

	// --- Step
	function Step() {
		this.__meta = [
			"id",
			"label",
			"details",
			"validated",
			"attachments",
			"manager",
			"endDate",
			"tasks",
			"isEditable",
			"flow"
		]

		// manager getter/setter
		Object.defineGetterAndSetter(this, "manager", {
			get: function() {
				return Model.prototype.findById(User, this.manager);
			},
			set: function(managerId) {
				this.manager = managerId;
			}
		});

		Object.defineGetterAndSetter(this, "tasks", {
			get: function() {
				return Model.prototype.findByIds(Task, this.tasks);
			},
			set: function(tasksId) {
				this.tasks = tasksId;
			}
		});
	}

	Step.prototype = new Model;
	Step.prototype.constructor = "Step";

	function Task() {
		this.__meta = [
			"id",
			"name",
			"status",
			"alertMessage",
			"actor",
			"isEditable"
		]
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
			var flow = Model.prototype.findById(Flow, Flow,id);
			flowDetailView.render(flow);
		},
		save: function(flow, callback) {
			// Property merge
			if (flow.id) {
				var f = Flow.findById(Flow, flow.id);
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
			var step = Step.findById(Step, id);
			stepDetailView.render(step);
		}
	};


	/****************
	* 	Views
	****************/
	var flowListView = {
		render: function(flows) {
			if (!flows) {
				var flows = new Flow().findAll();
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
			$(document).on("Flow.save.flowlist", function(e) {
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

	window.store.insert(Flow, flows);
	window.store.insert(Process, processes);
	window.store.insert(Company, companies);
	window.store.insert(User, users);
	window.store.insert(Step, steps);
	window.store.insert(Task, tasks);

	FlowController.list();
});