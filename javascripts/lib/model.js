define(["Store"], function(Store) {
    function Model() {};
    Model.prototype.save =  function() {
        console.log("Save model");
        Store.save(this);
    };
    Model.prototype.findAll = function(modelType) {
        return Store.all(modelType);
    };
    Model.prototype.update = function() {
    };
    Model.prototype.destroy = function() {
    };
    Model.prototype.find = function(param) {
        Store.find(this.constructor, param);
    };
    Model.prototype.findByIds = function(modelType, ids) {
    	return Store.findIds(modelType, ids);
    };
    Model.prototype.findById = function(modelType, id) {
    	return Store.find(modelType, id);
    };
    
    Object.defineGetterAndSetter = function(obj, property, getterAndSetter) {
    	obj["get_"+property] = getterAndSetter.get;
    	obj["set_"+property] = getterAndSetter.set;
    }
    return Model;
});