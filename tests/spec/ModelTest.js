define(
['Store','Model'],
function(Store, Model){

	window.describe('Test model', function(){
    	
    	it('new model should inherit from model', function() {
        	function NewModel() {

	        }
    	    NewModel.prototype = new Model;
        	expect(typeof NewModel).toBe(typeof Model);
    	});

    	it('shall retrieve parameters', function() {
    		
    		// Arange
			function Entity() {
				this.__meta = [
				"id",
				"value",
				"name",
				"code"
				];

				// Process getter/setter
				Object.defineGetterAndSetter(this, "id", {
					set: function(id) {
						this.id = id;
					}
				});
			}

			Entity.prototype = new Model();
			Entity.prototype.constructor = "Entity";
			
			var expectedId = "1234";
			var ent = new Entity();

			// Act
			ent.id = expectedId;
			var entId = ent.id;

			// Assert
			expect(entId).toBe(expectedId);
    	});

	});
});
