var Console =  {
    init: function(conf) {
        this.conf = conf;
    },
	log: function(msg) {
		if (this.conf.mode == "dev" && window.console)
			console.log(msg);
	}
};