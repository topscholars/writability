import Ember from 'ember';

export default Ember.TextField.extend({

	classNames: ['form-date'],

	min: true,

	formatSubmit: "YYYY-MM-DD",

	momentFormat: function() {
		return this.get('format').toUpperCase();
	}.property('format'),

	didInsertElement: function() {
		Ember.run.scheduleOnce('afterRender', this, 'startPickadate');
	},

	startPickadate: function() {
		this.$().pickadate(this.get('options'));
	},

	_elementValueDidChange: function() {
		var value = this.$().val();
		var outputVal = moment(value, this.get('momentFormat'));
		this.set('dateBind', outputVal.format(this.get('formatSubmit')));

		this._super();
	},

	willInsertElement: function() {
		if (this.get('dateBind')) {
			var currentMoment = moment(this.get('dateBind'));
			this.set('value', currentMoment.format(this.get('momentFormat')));
		} else {
			this.set('value', 'Select Date');
		}

	},

	options: function() {
		var options = {
			format: this.get('format'),
			formatSubmit: this.get('formatSubmit'),
			hiddenName: true
		};

		if (this.get('min')) {
			options.min = this.get('min');
		}

		return options;
	}.property()
});
