define(["lib/model", "models/Process", "models/Company", "models/User", "models/Step"] , function(Model, Process, Company, User, Step) {
	function Flow() {
		this.__meta = [
			"id",
			"label",
			"company",
			"process",
			"owner",
			"startDate",
			"endDate",
			"steps"
		];
	
		// Process getter/setter
		Object.defineGetterAndSetter(this, "process", {
			get: function() {
				return Model.prototype.findById(Process, this.process);
			},
			set: function(processId) {
				this.process = processId;
			}
		});
	   
		// Company getter/setter
		Object.defineGetterAndSetter(this, "company", {
			get: function() {
				return Model.prototype.findById(Company, this.company);
			},
			set: function(companyId) {
				this.company = companyId;
			}
		});
	
		// Owner getter/setter
		Object.defineGetterAndSetter(this, "owner", {
			get: function() {
				return Model.prototype.findById(User, this.owner);
			},
			set: function(ownerId) {
				this.owner = ownerId;
			}
		});
	
		// Company getter/setter
		Object.defineGetterAndSetter(this, "steps", {
			get: function() {
				var steps = Model.prototype.findByIds(Step, this.steps);
				_.each(steps, function(step, index) {
					step.flow = this;
				});
				return steps;
			},
			set: function(stepsId) {
				this.steps = stepsId;
			}
		});
		
	};
	Flow.prototype = new Model();
	Flow.prototype.constructor = "Flow";
	
	return Flow;
});