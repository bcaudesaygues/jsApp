define(['jQuery', 'Store', "Router", "Moment", "controllers/Flow", "models/Company","models/Process", "models/User", "models/Task", "models/Step", "models/Flow"], 
function ($, Store, Router, moment, FlowController) {
    $(document).ready(function() {
        moment.lang('fr');
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
    			
    			$.ajaxSetup({async: false, cache: true});
    			$.getScript("/companies.js", function() { 
    				Store.insert(Company.prototype, companies);
    			});
    			$.getScript("/processes.js", function() { 
    				Store.insert(Process.prototype, processes);
    			});
    			$.getScript("/users.js", function() { 
    				Store.insert(User.prototype, users);
    			});
    			$.getScript("/tasks.js", function() { 
    				Store.insert(Task.prototype, tasks);
    			});
    			$.getScript("/steps.js", function() { 
    				Store.insert(Step.prototype, steps);
    			});
    			$.getScript("/data.js", function() { 
    				Store.insert(Flow.prototype, flows);
    			});
    		},
    		router: Router,
    		launch: function() {
    			Console.log("intializing app");
    			this.init();
    			Console.log("launching app");
                Router.start(FlowController.list, true);
    		}
    	};
        
        App.launch();
	}); 
});