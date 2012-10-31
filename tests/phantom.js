var page = new WebPage()
page.onConsoleMessage = function(msg) {
    console.log(msg)
}
page.open('http://localhost:7357/', function(status){
    page.evaluate(function(){
        console.log(navigator.userAgent)
    })
})
