function Task() {
	this.__meta = [
		"id",
		"name",
		"status",
		"alertMessage",
		"actor",
		"isEditable"
	]

	Object.defineGetterAndSetter(this, "actor", {
		get: function() {
			return Model.prototype.findById(User, this.actor)
		},
		set: function(actorId) {
			this.actor = actorId;
		}
	})
}
Task.prototype = new Model;
Task.prototype.constructor = "Task";