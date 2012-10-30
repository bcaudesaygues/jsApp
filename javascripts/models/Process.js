function Process() {
	this.__meta = [
		"id",
		"name"
	]
};
Process.prototype = new Model;
Process.prototype.constructor = "Process";