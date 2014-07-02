App.FormSelect2Component = Ember.TextField.extend({
	type: 'hidden',
	select2Options: {},
	prompt: 'Please select...',

	didInsertElement: function () {
		Ember.run.scheduleOnce('afterRender', this, 'processChildElements');
	},

	processChildElements: function () {
		this.$().select2(this.get('select2Options'));
	},

	willDestroyElement: function () {
		this.$().select2("destroy");
	}
});
