App.FormDateComponent = Ember.TextField.extend({
	didInsertElement: function() {
		Ember.run.scheduleOnce('afterRender', this, 'startPickadate');
	},

	startPickadate: function() {
		this.$().pickadate(this.get('options'));
	},

	options: function() {
		return {
			format: this.get('format'),
			formatSubmit: this.get('formatSubmit'),
			min: this.get('min'),
			hiddenName: true
		};
	}.property()
});
