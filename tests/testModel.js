describe('Test model', function(){
    it('new model should inherit from model', function() {
        function NewModel() {

        }
        NewModel.prototype = new Model;
        expect(typeof NewModel).toBe(Model);
    });
});