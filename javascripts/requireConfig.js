var serverUrl = window.location.protocol + "//" + window.location.host + "/";
var require = {
	enforceDefine: true,
	baseUrl: "/javascripts",
	waitSeconds: 15,
	baseUrl: '/javascripts',
    deps: [serverUrl + "javascripts/lib/logger.js"],
	paths: {
		libs: serverUrl + "javascripts/lib/"
	},
	map: {
		"*": {
			jQuery: 'libs/jQuery/jquery-1.7.2',
			Underscore: 'libs/underscore',
			Store: 'libs/store',
			TemplateEngine: 'libs/mustache',
            Template: 'libs/mustache-custom',
			Json: "libs/json2",
	        Router: "libs/router",
			Model: 'libs/model'
		}
	},
	shim: {
		'libs/jQuery/jquery-1.7.2': {
			exports: '$'
		},
		'libs/json2': {
			exports: 'JSON'
		},
		'libs/store': {
			deps: ['jQuery','Underscore', 'Json'],
			exports: 'Store'
		},
		'libs/model': {
            deps: ['Store'],
            exports: 'Model'
        },
		'libs/underscore': {
			exports: '_'
		},
		'libs/mustache': {
			exports: 'Mustache'
		},
        'libs/routeur': {
            exports: 'Router'
        }
	}
};
