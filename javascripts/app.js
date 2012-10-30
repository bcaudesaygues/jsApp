$(document).ready(function() {
	var App = {
		conf: {
			mode: "dev"
		},
        init: function() {
            if (document.addEventListener) {
                document.addEventListener("storage", window.store.storeEvent, false);
                document.addEventListener("storagecommit", window.store.storeEvent, false);
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
        },
        launch: function() {
            this.init();
	        FlowController.list();
        }
	};

    App.launch();
});