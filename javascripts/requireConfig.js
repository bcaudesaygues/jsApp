var BASE_PATH = (BASE_PATH === 'undefined') ? '' : BASE_PATH;

var req_config = require = {
    enforceDefine: true,
    baseUrl: BASE_PATH + "/javascripts",
    waitSeconds: 15,

    paths: {
        jQuery: 'lib/jQuery/jquery-1.7.2',
        jQueryUi: 'lib/jQuery/ui/jqueryUI',
        jQueryDatepicker: 'lib/jQuery/ui/jquery-ui-1.8.19.custom.min',
        jQuerySexyAutocomplete: 'lib/jQuery/plugins/jquery-sexyAutocomplete',
        Underscore: 'lib/underscore',
        Store: 'lib/store',
        Template: 'lib/mustache'
    },
    shim: {
        jQuery: {
            exports: '$'
        },
        jQueryDatepicker: {
            deps: ['jQuery']
        },
        jQuerySexyAutocomplete: {
            deps: ['jQuery','jQueryDatepicker']
        },
        Store: {
            deps: ['jQuery','Underscore'],
            exports: 'Store'
        },
        Underscore: {
            exports: '_'
        },
        Template: {
            exports: 'mustache'
        }
    }
};
