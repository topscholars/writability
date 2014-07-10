App.FormDateComponent = Ember.TextField.extend({
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
		var currentMoment = moment(this.get('dateBind'));
		this.set('value', currentMoment.format(this.get('momentFormat')));
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
