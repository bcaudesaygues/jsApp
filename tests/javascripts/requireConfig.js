var require = {
	enforceDefine: true,
	baseUrl: "/javascripts",
	waitSeconds: 15,

    deps: ["lib/logger"],
	paths: {
		jQuery: 'lib/jQuery/jquery-1.7.2',
		/*
		jQueryUi: 'lib/jQuery/ui/jqueryUI',
		jQueryDatepicker: 'lib/jQuery/ui/jquery-ui-1.8.19.custom.min',
		jQuerySexyAutocomplete: 'lib/jQuery/plugins/jquery-sexyAutocomplete',
		*/
		Underscore: 'lib/underscore',
		Store: 'lib/store',
		Template: 'lib/mustache',
		Json: "lib/json2",
        Router: "lib/router",
	},
	shim: {
		jQuery: {
			exports: '$'
		},
		/*
		jQueryDatepicker: {
			deps: ['jQuery']
		},
		jQuerySexyAutocomplete: {
			deps: ['jQuery','jQueryDatepicker']
		},
		*/
		Json: {
			exports: 'JSON'
		},
		Store: {
			deps: ['jQuery','Underscore', 'Json'],
			exports: 'Store'
		},
		Underscore: {
			exports: '_'
		},
		Template: {
			exports: 'Mustache'
		},
        Router: {
            exports: 'Router'
        }
	}
};
