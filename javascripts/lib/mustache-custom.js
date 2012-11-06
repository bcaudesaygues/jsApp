define(["TemplateEngine", "Model"], function(Mustache, Model) {
    
    Mustache.Context.prototype.lookup = function (name) {
        var value = this._cache[name];
    
        if (!value) {
            if (name === ".") {
                value = this.view;
            } else {
                var context = this;
        
                while (context) {
                    if (name.indexOf(".") > 0) {
                        var names = name.split(".");
                        var i = 0;
                        
                        value = context.view;
                        
                        while (value && i < names.length) {
                            if (value["get_" + names[i]]) {
                                value = value["get_" + names[i]]();
                            } else {
                                value = value[names[i]];
                            }
                            i++;
                        }
                    } else {
                        if (context.view !== null) {
                            if (context.view["get_" + name] !== undefined) {
                                value = context.view["get_" + name]();
                            } else {
                                value = context.view[name];
                            }
                        }
                    }
                    
                    if (value !== null) {
                        break;
                    }
                    context = context.parent;
                }
            }
    
            this._cache[name] = value;
        }
    
        if (typeof value === "function") {
            value = value.call(this.view);
        }
    
        return value;
    };
    
    return Mustache;
});