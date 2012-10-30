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
		set: function(tasksId) {
			this.tasks = tasksId;
		}
	});
}

Step.prototype = new Model();
Step.prototype.constructor = "Step";