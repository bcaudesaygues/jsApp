define(['jQuery', 'Store', "Router", "models/Company","models/Process", "models/User", "models/Task", "models/Step", "models/Flow", "controllers/Flow"], function ($, Store, Router) {
    $(document).ready(function() {
    	var App = {
    		conf: {
    			mode: "dev"
    		},
    		init: function() {
    			var Company = require("models/Company");
    			var Process = require("models/Process");
    			var User = require("models/User");
    			var Task = require("models/Task");
    			var Step = require("models/Step");
    			var Flow = require("models/Flow");
    			
    			
    			if (document.addEventListener) {
    				window.addEventListener("storage", Store.storeEvent, false);
    				window.addEventListener("storagecommit", Store.storeEvent, false);
    			} else {
    				document.attachEvent("onstorage", Store.storeEvent);
    				document.attachEvent("onstoragecommit", Store.storeEvent);
    			};
    			$.ajaxSetup({async: false, cache: true});
    			$.getScript("/companies.js", function() { 
    				Store.insert(Company, companies);
    			});
    			$.getScript("/processes.js", function() { 
    				Store.insert(Process, processes);
    			});
    			$.getScript("/users.js", function() { 
    				Store.insert(User, users);
    			});
    			$.getScript("/tasks.js", function() { 
    				Store.insert(Task, tasks);
    			});
    			$.getScript("/steps.js", function() { 
    				Store.insert(Step, steps);
    			});
    			$.getScript("/data.js", function() { 
    				Store.insert(Flow, flows);
    			});
    		},
    		router: Router,
    		launch: function() {
    			Console.log("intializing app");
    			this.init();
    			Console.log("launching app");
    			this.router.route("FlowController", "list");
    		}
    	};
        
        App.launch();
	}); 
});