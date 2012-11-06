define(["Template", "Router"], function(Template, Router) {
    var stepDetailView = {
        render: function(step) {
    		if (!step) {
    			return;
    		}
    		var html = Template.render($("#step-detail-template").html(), {"step": step});
    		$("#step-detail").html(html);
    		$("#step-detail").removeClass("display-none");
    		this.bind();
    	},
    	bind: function() {
    		// Remove all previous event handler
    		this.unbind();

    		// Close popup
    		$("#step-detail").on("click.Step", ".close", stepDetailView.close);

            // --- STEP ---
            // Edit Step
            $("#step-detail").on("click.editStep", ".step .edit-mode", stepDetailView.editMode);
            // Cancel Step edit
            $("#step-detail").on("click.cancelEdit", ".step .cancel", stepDetailView.cancelEdit);
            // Save Step
            $("#step-detail").on("submit.saveStep", ".step .edit form", stepDetailView.saveStep);

            // --- TASK ---
            // Toggle task edit mode
            $("#step-detail").on("click.editTask", ".task", stepDetailView.taskEditMode)  ;
            // Save task
            $("#step-detail").on("submit.saveTask", ".task .edit form", stepDetailView.saveTask);
    	},
    	unbind: function() {
    		$("#step-detail").unbind("click.Step");
            $("#step-detail").unbind("click.editStep");
            $("#step-detail").unbind("click.cancelEdit");
            $("#step-detail").unbind("submit.saveStep");
            $("#step-detail").unbind("click.editTask");
            $("#step-detail").unbind("submit.saveTask");
    	},
        editMode: function(e) {
            e.preventDefault();
            $(this).parents(".step").find(".edit").removeClass("display-none");
            $(this).parents(".step").find(".show").addClass("display-none");
        },
        cancelEdit: function(e) {
            e.preventDefault();
            $(this).parents(".step").find(".edit").addClass("display-none");
            $(this).parents(".step").find(".show").removeClass("display-none");
        },
        saveStep: function(e) {
            e.preventDefault();
            var step = bindFormToObj($(this));
            Router.route("StepController", "save", step);
        },
        taskEditMode: function(e) {
            $(this).find(".edit").removeClass("display-none");
            $(this).find(".show").addClass("display-none");
        },
        taskShowMode: function(taskNode) {
            taskNode.find(".edit").addClass("display-none");
            taskNode.find(".show").removeClass("display-none");
        },
        saveTask: function(e) {
            Console.log("Submit task form");
            event.preventDefault();
            var task = bindFormToObj($(this));
            //Router.route("stepController","saveTask", task);
            stepDetailView.taskShowMode($(this).parents(".task"));
        },
    	close: function() {
    		$("#step-detail").addClass("display-none");
    		stepDetailView.unbind();
    		$("#step-detail").html("");
    	}
    };
    var stepCreateView = {
        render: function(step, flowId) {
            if (!step) {
        		return;
    		}
            var data = {"step": step, "flow": flowId};
            var template = $("#step-create-template").html();
    		var html = Template.render(template, data);
    		$("#step-create").html(html);
    		$("#step-create").removeClass("display-none");
    		this.bind();
        },
        bind: function() {
            $("#step-create").on("submit.createStep", function(e) {
                e.preventDefault();
                var step = bindFormToObj($(this));
                Router.route("StepController", "save", step, stepCreateView.close);
            });
            
            $("#step-create").on("click.close", ".close", function(e) {
                e.preventDefault();
                stepCreateView.close();
            });
        },
        unbind: function() {
            $("#step-create").unbind("submit.createStep");
        },
        close: function() {
            $("#step-create").addClass("display-none");
        	stepDetailView.unbind();
    		$("#step-create").html("");
        }
    };
    
    return { "show" : stepDetailView, "create": stepCreateView};
});