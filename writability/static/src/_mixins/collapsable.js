App.Collapsable = Ember.Mixin.create({
	collapseActive: false,

	actions: {
		toggleCollapse: function() {
			this.set('collapseActive', !this.get('collapseActive'));
			console.log(this.get('collapseActive'))
		}
	}
});
