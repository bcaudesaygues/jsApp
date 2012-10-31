define([], function() {
    window.Console =  {
        conf: {
            mode: "dev"
        },
        isInit: false,
        init: function(conf) {
            this.conf = conf;
            this.isInit = true;
        },
        log: function(msg) {
            if (!this.isInit) {
                this.init(this.conf);
            }
            if (this.conf.mode == "dev" && window.console)
                console.log(msg);
        }
    };
});