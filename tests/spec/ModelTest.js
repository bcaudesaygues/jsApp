define(
['Store','Model'],
function(Store, Model){

	window.describe('Test model', function(){
    	
		it('shall calculate fibo in less than 1.2 s', function() {

			var start = +new Date();  // log start timestamp

    		var first,second,add;
			for(var i=0;i<7500;i++){
			    if(i === 0){
			        first = 1;
			        second = 2;
			    }
			    add = first + second;
			    first = second;
			    second = add;
			}

			var end = +new Date();  // log end timestamp
			var duration = end - start;

			expect(duration).toBeLessThan(1.2);
    	});

    	it('new model should inherit from model', function() {
        	function NewModel() {

	        }
    	    NewModel.prototype = new Model;
        	expect(typeof NewModel).toBe(typeof Model);
    	});

    	it('shall retrieve setted parameters', function() {
    		
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
			Entity.prototype.constructor = Entity;
			
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
