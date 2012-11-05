
var serverUrl = (serverUrl===undefined) ? window.location.protocol + "//" + window.location.host + "/" : serverUrl;

var test_config = {
    paths: {
    	specs: serverUrl+'tests/spec',
    },
    map: {
    	modelTest : 'specs/ModelTest',
    }
};

require.config(test_config);

define(
['specs/ModelTest'],
function(){
    var env = jasmine.getEnv();
    env.updateInterval = 1000;
    env.addReporter(new jasmine.HtmlReporter);
    env.execute();
});