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


	
	/****************
	*	Models
	****************/
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