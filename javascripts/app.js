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
	    		return Model.prototype.findById(Process, this._processId);
    		},
    		set: function(processId) {
	    		this._processId = processId;
	    	}
    	});
	   
	    // Company getter/setter
	    Object.defineGetterAndSetter(this, "company", {
	    	get: function() {
		    	return Model.prototype.findById(Company, this._companyId);
		    },
		    set: function(companyId) {
		    	this._companyId = companyId;
		    }
	    });

	    // Owner getter/setter
	    Object.defineGetterAndSetter(this, "owner", {
	    	get: function() {
		    	return Model.prototype.findById(User, this._ownerId);
		    },
		    set: function(ownerId) {
		    	this._ownerId = ownerId;
		    }
	    });

	    // Company getter/setter
	    Object.defineGetterAndSetter(this, "steps", {
	    	get: function() {
		    	var steps = Model.prototype.findByIds(Step, this._stepsId);
		    	_.each(steps, function(step, index) {
		    		step.flow = this;
		    	});
		    	return steps
		    },
		    set: function(stepsId) {
		    	this._stepsId = stepsId;
		    }
	    });
	    
	};
	Flow.prototype = new Model;
	Flow.prototype.constructor = "Flow";

	Flow.prototype.save = function() {
		Console.log("Saving Flow and launching event");
		window.store.save(this);
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
				return new User().findById(this._managerId);
			},
			set: function(managerId) {
				this._managerId = managerId;
			}
		});
	}

	Step.prototype = new Model;
	Step.prototype.constructor = "Step";


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
			$("#app").on("click.FlowList", "ul li", function(e) {
				e.preventDefault();
				var id = $(this).find("input[name='id']").val();
				FlowController.show(id);
			});

			$("#app").on("click.addFlow", "a.add-flow", function(e) {
				e.preventDefault();
				FlowController.addFlowForm();
			});

			$(document).on("Flow.save.flowlist", function(e) {
				flowListView.destroy();
				flowListView.render();
			});
		},
		unbind: function() {
			$("#app").unbind("click.FlowList");
			$("#app").unbind("click.addFlow");
			$(document).unbind("Flow.save.flowlist");
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
			$("#app #flow-detail").on("click.Flow", ".close", flowDetailView.close);

			// Save change
			$("#app #flow-detail").on("submit.Flow", "form", this.save);
		},
		unbind: function() {
			$("#app #flow-detail").unbind("click.Flow");
			$("#app #flow-detail").unbind("submit.Flow");
		},
		close: function() {
			flowDetailView.unbind();
			$("#app #flow-detail form").remove();
		}
	}

	window.store.insert(Flow, flows);
	window.store.insert(Process, processes);
	window.store.insert(Company, companies);
	window.store.insert(User, users);
	window.store.insert(Step, steps);

	FlowController.list();
});