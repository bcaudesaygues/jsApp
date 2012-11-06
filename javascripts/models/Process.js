define(["lib/model"] , function(Model) {
	function Process() {
		this.__meta = [
			"id",
			"name"
		]
	};
	Process.prototype = new Model;
	Process.prototype.constructor = Process;
	return Process;
});