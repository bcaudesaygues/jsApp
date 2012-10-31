define([], function() {
    
    
    var Router = {
        controllers: [],
        route: function(controller, action) {
            arguments = _.toArray(arguments);
            var args = arguments.slice(2, arguments.length+1);
            this.controllers[controller][action].apply(this.controllers[controller], args);
        }
    };
    return Router;
});