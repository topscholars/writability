import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['form-number'],

	min: null,
	max: null,
	value: null,

	willInsertElement: function() {
		if (!this.get('value')) {
			this.set('value', 0);
		}
	},

	canIncrement: function() {
		var max = this.get('max');

		if (max === null) {
			return true;
		}

		return this.get('value') < max;
	}.property('value'),

	canDecrement: function() {
		var min = this.get('min');

		if (min === null) {
			return true;
		}

		return this.get('value') > min;
	}.property('value'),

	actions: {
		increment: function() {
			if (this.get('canIncrement')) {
				this.incrementProperty('value');
			}
		},
		decrement: function() {
			if (this.get('canDecrement')) {
				this.decrementProperty('value');
			}
		}
	}
});
