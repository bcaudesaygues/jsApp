define(
['ModelTest'], 
function(){
    var env = jasmine.getEnv();

    env.updateInterval = 1000;
    env.addReporter(new jasmine.HtmlReporter);
    env.execute();
});