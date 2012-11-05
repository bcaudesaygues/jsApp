define(
['Store','Model'],
function(Store, Model){

	window.describe('Test model', function(){
    	
    	it('shall fail in IE8', function() {
    		try {
	        	var human = function() {
				    var _firstName = '';
				    var _lastName = ''
				    return {
				        get firstName() {
				            return _firstName;
				        }, get lastName() {
				            return _lastName;
				        }, set firstName(name) {
				            _firstName = name;
				        }, set lastName(name) {
				            _lastName = name;
				        }, get fullName() {
				            return _firstName + ' ' + _lastName;
				        }
				    }
				}();
				human.firstName = 'Saeed';
				human.lastName = 'Neamati';
				expect(human.fullName).toBe("Saeed Neamati");
			} catch(err) {
				expect(true).toBe(false);
			}
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
