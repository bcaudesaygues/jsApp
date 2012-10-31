define(["lib/model"] , function(Model) {
	function User() {
		this.__meta = [
			"id",
			"name",
			"isAccountActive"
		];
	}
	User.prototype = new Model();
	User.prototype.constructor = "User";
	return User;
});