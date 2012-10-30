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
            var obj = new modelType();
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
            obj.prototype = new modelType();
            return obj;
        },
        _createKey : function(modelName, id) {
            return [modelName, id].join('-');
        },
        
        insert: function(modelType, collection) {
            var modelName = modelType.prototype.constructor;
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
            this._ids[modelType.prototype.constructor] == this._ids[modelType.prototype.constructor]++;
            return this._ids[modelType.prototype.constructor];
        },
        all: function(modelType) {
            var modelName = modelType.prototype.constructor;
            var collection = this._store[modelName];
            var elems = [];
            for (var i = 0; i < collection.length; i++) {
                var json = localStorage.getItem(collection[i]);
                var obj = JSON.parse(json)
                elems.push(this.factory(modelType,obj));
            }
            return elems;
        },
        find: function(modelType, id) {
            var modelName = modelType.prototype.constructor;
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
            var type = obj.constructor;
            var key = this._createKey(type, obj.id);
            
            var json = $.toJSON(obj);
            
            if ("onstorage" in document) {
                localStorage.setItem('_key', key);
            }
            this._event = "save";
            this._type = type;
            this._last_sent_key = key;
            localStorage.setItem(key, json);
            if(this._store[obj.constructor] === undefined) {
                this._store[obj.constructor] = [];
            }
            this._store[obj.constructor].push(key);
        },
        bind: function() {
            if (document.addEventListener) {
                document.addEventListener("storage", event_storage, false);
                document.addEventListener("storagecommit", event_storage, false);
            } else {
                $(document).on("onstorage", { name: "Karl" }, this.event);
                $(document).on("onstoragecommit", { name: "Karl" }, this.event);
                //document.attachEvent("onstoragecommit", this.event);
            };
        },
        storeEvent: function(e) {
            var key = localStorage.getItem("_key");
            if(key !== null && key !== "_key"){
                var event = [window.store._type,window.store._event].join('.');
                $(document).triggerHandler(event, key);
            }
        }
    }
    window.store = Store;
})(window,window._);