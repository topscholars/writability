App.FormNumberComponent = Ember.Component.extend({
	classNames: ['form-number'],
	min: null,
	max: null,
	value: null,

	willInsertElement: function() {
		if (!this.get('value')) {
			this.set('value', 0);
		}
	},

	actions: {
		increment: function() {
			this.incrementProperty('value');
		},
		decrement: function() {
			this.decrementProperty('value');
		}
	}
});
