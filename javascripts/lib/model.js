function Model() {};
Model.prototype.save =  function() {
    window.store.save(this);
};
Model.prototype.findAll = function(modelType) {
    return window.store.all(modelType);
};
Model.prototype.update = function() {
};
Model.prototype.destroy = function() {
};
Model.prototype.find = function(param) {
    window.store.find(this.constructor, param);
};
Model.prototype.findByIds = function(modelType, ids) {
	return window.store.findIds(modelType, ids);
};
Model.prototype.findById = function(modelType, id) {
	return window.store.find(modelType, id);
};

Object.defineGetterAndSetter = function(obj, property, getterAndSetter) {
	obj["get_"+property] = getterAndSetter.get;
	obj["set_"+property] = getterAndSetter.set;
}