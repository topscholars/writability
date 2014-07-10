App.FormDateComponent = Ember.TextField.extend({
	min: true,

	formatSubmit: "YYYY-MM-DD",

	didInsertElement: function() {
		Ember.run.scheduleOnce('afterRender', this, 'startPickadate');
	},

	startPickadate: function() {
		this.$().pickadate(this.get('options'));
	},

	_elementValueDidChange: function() {
		var value = this.$().val();
		var outputVal = moment(value, this.get('format').toUpperCase());
		this.set('dateBind', outputVal.format(this.get('formatSubmit')));

		this._super();
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
