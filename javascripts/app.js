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
	}

	/****************
	*	Models
	****************/
    function Flow() {
        this.__meta = [
        	"id",
            "name",
            "company",
            "process",
            "owner",
            "startDate",
            "endDate"
        ]
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
	Flow.prototype.findById = function(id) {
		return Store.find(this.constructor, function(item, index, val) {
			return item.id == id;
		})[0];
	};

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
			var html = ["<a href='' class='add-flow'>Add flow</a><ul>"];
			var flowsLength = flows.length;
			for (i = 0; i<flowsLength; i++) {
				var flow = flows[i];
				html.push("<li>");
				html.push("<span class='id'><input type='hidden' name='id' value='" + flow.id + "'/>" + flow.name + "</span>");
				html.push("</li>");
			}
			html.push("</ul>");
			$("#app #flow-list").html(html.join(""));

			this.bind();
		},
		bind: function() {
			$("#app").on("click.FlowList", "ul li", function(e) {
				e.preventDefault();
				var id = $(this).find(".id input").val();
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
			var html = "<form><div class='title'>Flow " + flow.name + " detail <a class='close'>X</a></div><div class='detail'>" + 
					"<input type='hidden' name='id' value='" + flow.id + "'><br/>" +
					"<label>Name:</label><input type='text' name='name' value='" + flow.name + "'><br/>" +
					"<label>Company:</label><input type='text' name='company' value='" + flow.company + "'><br/>" +
					"<label>Process:</label><input type='text' name='process' value='" + flow.process + "'><br/>" +
					"<label>Owner:</label><input type='text' name='owner' value='" + flow.owner + "'><br/>" +
					"<label>startDate:</label><input type='text' name='startDate' value='" + flow.startDate + "'><br/>" +
					"<label>endDate:</label><input type='text' name='endDate' value='" + flow.endDate + "'><br/>" +
				"</div><input type='submit' value='Enregistrer'/></form>";
			$("#flow-detail").html(html);
			this.bind();
		},
		save: function(event) {
			event.preventDefault();
			Console.log("flowDetailView save");
			Console.log(event);
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
	Store.load(Flow, flows);

	FlowController.list();
});