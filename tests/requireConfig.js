var BASE_PATH = (BASE_PATH === 'undefined') ? '' : BASE_PATH;

var req_config = require = {
    enforceDefine: true,
    baseUrl: "spec/javascripts/fixture/AddUser_files",
    waitSeconds: 15,

    paths: {
        jQuery: 'lib/jQuery/jquery-1.7.2',
        jQueryUi: 'lib/jqueryUI/jqueryUI',
        jQueryDatepicker: 'lib/jqueryUI/jquery-ui-1.8.19.custom.min',
        jQueryDatepickerLang: 'lib/jqueryUI/datepicker/jquery.ui.datepicker-lang',
        jQueryClickOutside: 'lib/jqueryPlugins/jquery-clickoutside.min',
        jQuerySexyRadio: 'lib/jqueryPlugins/jquery-sexyRadio',
        jQuerySexyAutocomplete: 'lib/jqueryPlugins/jquery-sexyAutocomplete',
        jQueryDownload: 'lib/jqueryPlugins/jquery.download',
        ember: 'lib/ember/init-ember',
        srcEmber: 'lib/ember/ember-0.9.8.1',
        moment: 'lib/moment/init-moment',       
        srcMoment: 'lib/moment/moment',
        momentlang: 'lib/moment/lang-all.min',
        Underscore: 'lib/underscore',
        syrah: 'lib/syrah/init-syrah',
        srcSyrah: 'lib/syrah/syrah',
        cabernet: 'lib/cabernet/cabernet',
        inativ: 'inativ_ember',
        fileUpload: 'lib/jqueryPlugins/jquery.upload-1.0.2'
    },
    shim: {
        jQuery: {
            exports: '$'
        },
        jQueryDatepicker: {
            deps: ['jQuery'],
            exports: '$'
        },
        jQueryDatepickerLang: {
            deps: ['jQuery', 'jQueryDatepicker'],
            exports: '$'
        },
        jQuerySexyRadio: {
            deps: ['jQuery'],
            exports: '$'
        },
        jQuerySexyAutocomplete: {
            deps: ['jQuery','jQueryDatepicker'],
            exports: '$'
        },
        jQueryDownload: {
            deps: ['jQuery'],
            exports: '$'
        },
        moment: {
            deps: ['ember', 'srcMoment' ,'momentlang'],
            exports: 'moment',
            init: function(Ember) {
                Ember.Logger.info('RequireConfig: Load lib moment');
            }
        },
        srcMoment: {
            exports: 'moment'
        },
        momentlang: {
            deps: ['ember','srcMoment'],
            exports: 'moment',
            init: function(Ember) {
                Ember.Logger.info('RequireConfig: Load lang moment');   
            }
        },
        syrah: {
            deps: ['ember','srcSyrah'],
            exports: 'Syrah',
            init: function(Ember) {
                Ember.Logger.info('RequireConfig: Init lib Syrah');   
            }
        },
        cabernet: {
            //deps: ['ember', 'jQueryUi', 'jQueryClickOutside', 'syrah'],
            deps: ['ember'],
            exports: 'Cabernet',
            init: function(Ember) {
                Ember.Logger.info('RequireConfig: Load lib cabernet');   
            }
        },
        Underscore: {
            exports: '_'   
        },
        srcEmber: {
            deps: ['jQuery'],
            exports: 'Ember'
        },
        ember: {
            deps: ['srcEmber'],
            exports: 'Ember'   
        },
        srcSyrah: {
            deps: ['ember'],
            exports: 'Syrah',
            init: function (Ember) {
                Ember.Logger.info('RequireConfig: Load lib syrah');
            }
        },
        jQueryClickOutside: {
            deps: ['jQuery'],
            exports: '$'
        },
        
        fileUpload: {
            deps: ['jQuery'],
            exports: '$'
        }
    }
};
