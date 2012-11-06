define(["Store"], function(Store) {
	function Model() {};
	Model.prototype.save =  function() {
		Store.save(this);
	};
	Model.prototype.findAll = function() {
		return Store.all(this);
	};
	Model.prototype.update = function() {
	};
	Model.prototype.destroy = function() {
	};
	Model.prototype.find = function(param) {
		Store.find(this, param);
	};
	Model.prototype.findByIds = function(ids) {
		return Store.findIds(this, ids);
	};
	Model.prototype.findById = function(id) {
		return Store.find(this, id);
	};
	Model.prototype.getTypeName = function() {
		var fName = this.constructor.toString();
		var regEx = /^function\s+([^(]+)/;
		var typeName = regEx.exec(fName)[1];
		if (typeName === undefined || typeName === null || typeName === '') {
			typeName = typeof this;	
		}
		return typeName;
	};
	
	Object.defineGetterAndSetter = function(obj, property, getterAndSetter) {
		obj["get_"+property] = getterAndSetter.get;
		obj["set_"+property] = getterAndSetter.set;
	};
	return Model;
});