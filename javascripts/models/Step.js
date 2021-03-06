define(["lib/model", "models/Task", "models/User"] , function(Model, Task, User) {
    // --- Step model ---
	function Step() {
        // --- ATTRIBUTES ---
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
			"flow",
            "nbTask",
            "status"
		];
    
		// manager
		Object.defineGetterAndSetter(this, "manager", {
			get: function() {
				return User.prototype.findById(this.manager);
			},
			set: function(managerId) {
				this.manager = managerId;
			}
		});
	
        // tasks
		Object.defineGetterAndSetter(this, "tasks", {
			get: function() {
				return Task.prototype.findByIds(this.tasks);
			},
			set: function(tasksId) {
				this.tasks = tasksId;
			}
		});
	}
	
	Step.prototype = new Model();
	Step.prototype.constructor = Step;
    
    // --- METHODS ---
    
	return Step;
});