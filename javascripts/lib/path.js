var Path = {
    'version': "0.8.4",
    'map': function (path) {
        if (Path.routes.defined.hasOwnProperty(path)) {
            return Path.routes.defined[path];
        } else {
            return new Path.core.route(path);
        }
    },
    'root': function (path) {
        Path.routes.root = path;
    },
    'rescue': function (fn) {
        Path.routes.rescue = fn;
    },
    'match': function (path, parameterize) {
        var params = {}, route = null, j, ok,// possible_routes, slice, i, j, compare,
            path = path.substr(1).split('/');
        for (route in Path.routes.defined) {
            if (route !== null && route !== undefined) {
                route = Path.routes.defined[route];
                if (route.fragments.length === path.length) {
                    ok = true;
                    for (j=0 ; ok && j < path.length ; j++) {
                        if (route.fragments[j].type === 'dynamic') {
                            params[route.fragments[j].token] = path[j];
                        } else if (route.fragments[j].token != path[j]) {
                            params = {};
                            ok = false;
                        }
                    }
                    if (ok) {
                        if (parameterize) {
                            route.params = params;
                        }
                        return route;
                    }
                }
/*

                possible_routes = route.partition();
                for (j = 0; j < possible_routes.length; j++) {
                    slice = possible_routes[j];
                    compare = path;
                    if (slice.search(/:/) > 0) {
                        for (i = 0; i < slice.split("/").length; i++) {
                            if ((i < compare.split("/").length) && (slice.split("/")[i].charAt(0) === ":")) {
                                params[slice.split('/')[i].replace(/:/, '')] = compare.split("/")[i];
                                compare = compare.replace(compare.split("/")[i], slice.split("/")[i]);
                                //TODO test last solution in https://github.com/mtrpcic/pathjs/issues/17 to enable multiple optional segments
                                // ie replace previous line by: slice = slice.replace(slice.split("/")[i], compare.split("/")[i]);
                            }
                        }
                    }
                    if (slice === compare) {
                        if (parameterize) {
                            route.params = params;
                        }
                        return route;
                    } else {
                        params = {};
                    }
                }*/
            }
        }
        return null;
    },
    'dispatch': function (passed_route) {
        var previous_route, matched_route;
        if (Path.routes.current !== passed_route) {
            Path.routes.previous = Path.routes.current;
            Path.routes.current = passed_route;
            matched_route = Path.match(passed_route, true);

            if (Path.routes.previous) {
                previous_route = Path.match(Path.routes.previous);
                if (previous_route !== null && previous_route.do_exit !== null) {
                    previous_route.do_exit();
                }
            }

            if (matched_route !== null) {
                if (Path.listenHashChange) {
                    matched_route.run();
                }
                Path.listenHashChange = true;
                return true;
            } else {
                if (Path.routes.rescue !== null) {
                    Path.routes.rescue();
                }
            }
        }
    },
    'listenHashChange': true,
    'listen': function () {
        var fn = function(){ Path.dispatch(location.hash); }

        if (location.hash === "") {
            if (Path.routes.root !== null) {
                location.hash = Path.routes.root;
            }
        }
        Path.listenHashChange = true;

        // The 'document.documentMode' checks below ensure that PathJS fires the right events
        // even in IE "Quirks Mode".
        if ("onhashchange" in window && (!document.documentMode || document.documentMode >= 8)) {
            window.onhashchange = fn;
        } else {
            setInterval(fn, 50);
        }

        if(location.hash !== "") {
            Path.dispatch(location.hash);
        }
    },
    'core': {
        'route': function (path) {
            if (path.length === 0 || path.substr(0, 1) !== '#') path = '#' + path;
            this.path = path;
            this.action = null;
            this.do_enter = [];
            this.do_exit = null;
            this.params = {};
            this.fragments = _.map(path.substr(1).split('/'), function(fragment) {
                return new Path.core.routeFragment(fragment);
            });
            Path.routes.defined[path] = this;
        },

        'routeFragment': function (fragment) {
            if (fragment.length === 0 || fragment.substr(0, 1) !== ':') {
                this.type = 'static';
                this.token = fragment;
            } else {
                this.type = 'dynamic';
                this.token = fragment.substr(1);
            }
        }
    },
    'routes': {
        'current': null,
        'root': null,
        'rescue': null,
        'previous': null,
        'defined': {}
    }
};
var log = (console && console.log) ? console.log : _.identity;
Path.core.route.prototype = {
    'to': function (fn) {
        this.action = fn;
        return this;
    },
    'enter': function (fns) {
        if (fns instanceof Array) {
            this.do_enter = this.do_enter.concat(fns);
        } else {
            this.do_enter.push(fns);
        }
        return this;
    },
    'exit': function (fn) {
        this.do_exit = fn;
        return this;
    },
    'url': function () {
        var url = [],
            args = ! _.isUndefined(arguments),
            argsInObj = (args && arguments.length === 1 && _.isObject(arguments[0])),
            argsIndex = 0,
            arg;
        for (var i=0 ; i < this.fragments.length ; i++) {
            if (this.fragments[i].type === 'dynamic') {
                if (! args) {
                    console.log("Error in route.url [" + this.path + "]: arguments expected"); //TODO throw error instead ?
                    return Path.routes.root;
                }
                if (argsInObj) {
                    arg = arguments[0][this.fragments[i].token];
                    if (_.isUndefined(arg)) {
                        log("Error in route.url [" + this.path + "]: argument missing: " + this.fragments[i].token); //TODO throw error instead ?
                        return Path.routes.root;
                    }
                } else {
                    if (argsIndex >= arguments.length) {
                        log("Error in route.url [" + this.path + "]: not enough arguments, found: " + arguments.join()); //TODO throw error instead ?
                        return Path.routes.root;
                    }
                    arg = arguments[argsIndex];
                    argsIndex++;
                }
                url.push(arg);
            } else {
                url.push(this.fragments[i].token);
            }
        }
        return '#' + url.join('/');
    },/*
    'partition': function () {
        var parts = [], options = [], re = /\(([^}]+?)\)/g, text, i;
        while (text = re.exec(this.path)) {
            parts.push(text[1]);
        }
        options.push(this.path.split("(")[0]);
        for (i = 0; i < parts.length; i++) {
            options.push(options[options.length - 1] + parts[i]);
        }
        return options;
    },*/
    'run': function () {
        var halt_execution = false, i, result, previous;

        if (this.hasOwnProperty("do_enter")) {
            if (this.do_enter.length > 0) {
                for (i = 0; i < this.do_enter.length; i++) {
                    result = this.do_enter[i].apply(this, null);
                    if (result === false) {
                        halt_execution = true;
                        break;
                    }
                }
            }
        }
        if (!halt_execution) {
            this.action.apply(this, _.values(this.params));
        }
    }
};