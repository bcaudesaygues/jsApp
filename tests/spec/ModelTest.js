define(
['Store','Model'],
function(Store, Model){

	window.describe('Test model', function(){

    	it('shall retrieve all saved objects', function() {
    		
    		// Arange
			function Entity() {
				this.__meta = [
				"id",
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

			// Act
			for(i=0; i<5; i++) {
				var ent = new Entity();
				ent.id = i;
				ent.save();
			}
			
			var retrievedEnts = Entity.prototype.findAll(Entity);

			// Assert
			expect(retrievedEnts.length).toBe(5);
    	});
    	
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

		it('shall retrieve saved objects by id', function() {
    		
    		// Arange
			function Entity() {
				this.__meta = [
				"id",
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
			
			var id = "1234";
			var ent = new Entity();
			ent.id = id;


			// Act
			ent.save();

			var retrievedEnt = Entity.prototype.findById(Entity,id);

			// Assert
			expect(retrievedEnt).toBeDefined();
    	});

	});
});
