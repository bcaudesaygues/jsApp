define(["lib/model"], function(Model) {
    function Company() {
        this.__meta = [
            "id",
            "value",
            "name",
            "code"
        ];
    }
    Company.prototype = new Model();
    Company.prototype.constructor = "Company";
    return Company;
});