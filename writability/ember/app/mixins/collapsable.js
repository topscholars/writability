import Ember from 'ember';

export default Ember.Mixin.create({
	collapseActive: false,

	actions: {
		toggleCollapse: function() {
			this.set('collapseActive', !this.get('collapseActive'));
		}
	}
});
