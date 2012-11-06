(function(window,_) {
	var Store = {
		_last_sent_key: null,
		object: [],
		_store: {},
		_ids: [],
		_event: "",
		_type: "",
		
		// Object factory

		// Object factory
		factory : function(modelType, arg) {
			var obj = new modelType.constructor();
			_.each(obj.__meta, function(propName, index) {
				if (this[propName]) {
					if (obj["set_" + propName]) {
						obj["set_" + propName](this[propName]);
					} else {
						obj[propName] = this[propName];
					}
				} else {
					obj[propName] = "";
				}
			}, arg);
			//obj.prototype = new modelType();
			return obj;
		},
		_createKey : function(modelName, id) {
			return [modelName, id].join('-');
		},
		
		insert: function(modelType, collection) {
			var modelName = modelType.getTypeName();
			if (!this._store[modelName]) {
				this._store[modelName] = [];
			}
			if (!this._ids[modelName]) {
				this._ids[modelName] = -1;
			}
			var length = collection.length;
			for (var i = 0; i < length; i++) {
				var obj = this.factory(modelType, collection[i]);
				this.save(obj);
				if (obj.id > this._ids[modelName])
					this._ids[modelName] = obj.id;
			}
		},
		getNextId: function(modelType) {
			this._ids[modelType] == this._ids[modelType]++;
			return this._ids[modelType];
		},
		all: function(modelType) {
			var modelName = modelType.getTypeName();
			var collection = this._store[modelName];
			var elems = [];
			if (!collection) {
				return elems;
			}
			for (var i = 0; i < collection.length; i++) {
				var json = localStorage.getItem(collection[i]);
				var obj = JSON.parse(json);
				elems.push(this.factory(modelType,obj));
			}
			return elems;
		},
		find: function(modelType, id) {
			var modelName = modelType.getTypeName();;
			var key = this._createKey(modelName, id);
			var json = localStorage.getItem(key);
			return this.factory(modelType, JSON.parse(json));
		},
		findIds: function(modelType, ids) {
			var elems = [];
			_.each(ids, function(id, index) {
				var elem = this.find(modelType, id);
				elems.push(elem);
			}, this);
			return elems;
		},
		save: function(obj) {
			var type = obj.getTypeName();
            
            if (!obj.id)
                obj.id = this.getNextId(type);
                
			var key = this._createKey(type, obj.id);
            
			this.setKey(key, obj);
			if(this._store[type] === undefined) {
				this._store[type] = [];
			}
            if (!_.contains(this._store[type], key)) {
				this._store[type].push(key);
            }
		},
		bind: function() {
			if (document.addEventListener) {
				$(document).on("onstorage", this.storeEvent);
				$(document).on("onstoragecommit", this.storeEvent);
			} else {
				$(document).on("onstorage", this.storeEvent);
				$(document).on("onstoragecommit", this.storeEvent);
			}
		},
		storeEvent: function(e) {
			var key = localStorage.getItem("_key");
			if(key !== null && key !== "_key"){
				var event = [Store._type,Store._event].join('.');
				console.log(event);
				$(document).triggerHandler(event, key);
			}
		},
		setKey: function(key, value) {
			var json = '';
			if(_.isString(value)) {
				json = value;
			} else {
				json = JSON.stringify(value);
			}
			localStorage.setItem(key,json);
			var event = [value.getTypeName(),'save'].join('.');
			$(document).triggerHandler(event, key);
		}
	};
	
	window.Store = Store;
	return Store;
})(window,window._);