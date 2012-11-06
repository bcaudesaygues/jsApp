define(["Underscore", "Path"], function(_, Path) {

    var Router = {
        controllers: [],
       /* route: function(controller, action) {
            arguments = _.toArray(arguments);
            var args = arguments.slice(2, arguments.length+1);
            this.controllers[controller][action].apply(this.controllers[controller], args);
        },*/
        action: function(controller, action, route) {
            // TODO assert action is a function
            var routeObj = Path.map('#'+route).to(_.bind(action, controller));
            var wrapped = function() {
                Router.changeHash(routeObj.url.apply(routeObj, arguments));
                return action.apply(controller, arguments);
            };
            wrapped._route = routeObj;
            return wrapped;
        },
        /**
         * Returns to the root location, without calling the root action
         */
        root: function() {
            Router.changeHash(Path.routes.root);
        },
        changeHash: function(path) {
            Path.listenHashChange = false;
            window.location.hash = path;
        },
        /* register: function(controller) {


         },*/
        start: function(root, execOnStart) {
            if (root) {
                Path.root(root._route.path);
                if (execOnStart) {
                    root._route.action();
                }
            }
            Path.listen(true);
        }

    };
    return Router;
});

