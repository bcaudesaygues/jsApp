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
        var obj = new modelType;
        _.each(obj.__meta, function(propName, index) {
            if (this[propName]) {
                obj[propName] = this[propName];
            } else {
                obj[propName] = "";
            }
        }, arg);

        Console.log(obj);
        obj.prototype = new modelType;
        return obj;
    };

    function Model() {};
    Model.prototype.save =  function() {
    };
    Model.prototype.findAll = function() {
    	return Store.all(this.constructor);
    };
    Model.prototype.update = function() {
    };
    Model.prototype.destroy = function() {
    };
    Model.prototype.find = function(param) {
        Store.find(this.constructor, param);
    };
    Model.prototype.findByIds = function(id) {
		return Store.find(this.constructor, function(item, index, val) {
			return $.inArray(item.id, id);
		});
	};
    Model.prototype.findById = function(id) {
		return Store.find(this.constructor, function(item, index, val) {
			return item.id == id;
		})[0];
	};

    var Store = {
		object: [],
		_store: {},
		_ids: [],

		load: function(modelType, collection) {
			var modelName = modelType.prototype.constructor;
			if (!this._store[modelName]) {
				this._store[modelName] = [];
			}
			if (!this._ids[modelName]) {
				this._ids[modelName] = -1;
			}
			var length = collection.length;
            for (i = 0; i < length; i++) {
            	var obj = factory(modelType, collection[i]);
				this._store[modelName].push(obj);
				if (obj.id > this._ids[modelName])
					this._ids[modelName] = obj.id;
            }
		},
		getNextId: function(modelType) {
			this._ids[modelType.prototype.constructor] == this._ids[modelType.prototype.constructor]++;
			return this._ids[modelType.prototype.constructor];
		},
		all: function(modelType) {
			return this._store[modelType]
		},
		find: function(modelType, callback) {
			var models = this._store[modelType];
			return models.filter(callback);
		},
		save: function(obj) {
			if (!obj.id) {
				this._ids[obj.constructor] = this._ids[obj.constructor] +1;
				var modelLastId = this._ids[obj.constructor];
				modelLastId++;
				obj.id = modelLastId;
				this._store[obj.constructor].push(obj);
			}
			return JSON.stringify(obj);
		}
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
	    this.__defineGetter__("process", function() {
	    	return new Process().findById(this._processId);
	    });
	    this.__defineSetter__("process", function(processId) {
	    	this._processId = processId;
	    });

	    // Company getter/setter
	    this.__defineGetter__("company", function() {
	    	return new Company().findById(this._companyId);
	    });
	    this.__defineSetter__("company", function(companyId) {
	    	this._companyId = companyId;
	    });

	    // Owner getter/setter
	    this.__defineGetter__("owner", function() {
	    	return new User().findById(this._ownerId);
	    });
	    this.__defineSetter__("owner", function(ownerId) {
	    	this._ownerId = ownerId;
	    });

	    // Company getter/setter
	    this.__defineGetter__("steps", function() {
	    	var steps = new Step().findByIds(this._stepsId);
	    	_.each(steps, function(step, index) {
	    		step.flow = this;
	    	});
	    	return steps
	    });
	    this.__defineSetter__("steps", function(stepsId) {
	    	this._stepsId = stepsId;
	    });
	};
	Flow.prototype = new Model;
	Flow.prototype.constructor = "Flow";

	Flow.prototype.save = function() {
		Console.log("Saving Flow and launching event");
		Store.save(this);
		$(document).triggerHandler("Flow.save", this);
	};
	Flow.prototype.findByName = function(name) {
		return Store.find(this.constructor, function(item, index, val) {
			return item.name == name;
		})[0];
	};
	// Flow.prototype.findById = function(id) {
	// 	return Store.find(this.constructor, function(item, index, val) {
	// 		return item.id == id;
	// 	})[0];
	// };

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
		this.__defineGetter__("manager", function() {
			return new User().findById(this._managerId);
		});
		this.__defineSetter__("manager", function(managerId) {
			this._managerId = managerId;
		});
	}

	Step.prototype = new Model;
	Step.prototype.constructor = "Step";


	/****************
	*	Controllers
	****************/
	var FlowController = {
		list: function() {
			flowListView.render(new Flow().findAll());
		},
		show: function(id) {
			var flow = new Flow().findById(id);
			flowDetailView.render(flow);
		},
		save: function(flow, callback) {
			// Property merge
			if (flow.id) {
				var f = new Flow().findById(flow.id);
				var flow = $.extend(f, true, flow);
			// Not in the store
			} else {
				flow = factory(Flow, flow);
			}
			flow.save();

			if (callback)
				callback();
		},
		addFlowForm: function() {
			var flow = factory(Flow, {})
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
			var flows = {"flows" :flows};
			var html = Mustache.render($("#flow-list-template").html(), flows);
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
			var html = Mustache.render($("#flow-detail-template").html(), {"flow": flow, "steps": flow.steps});
			$("#flow-detail").html(html);
			Console.log(flow.steps);
			this.bind();
		},
		save: function(event) {
			event.preventDefault();
			var flow = bindFormToObj($("#app #flow-detail form"));
			Console.log(flow);
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

	Store.load(Flow, flows);
	Store.load(Process, processes);
	Store.load(Company, companies);
	Store.load(User, users);
	Store.load(Step, steps);

	FlowController.list();
});