App.GeneralCollapseComponent = Ember.Component.extend({
	classNames: ['collapse'],
	classNameBindings: ['isActive'],

	didInsertElement: function () {
		if (!this.get('isActive')) {
			this.$().hide();
		}
	},

	toggleCollapse: function() {
		if (!this.get('isActive')) {
			this.$().slideUp();
		} else {
			this.$().slideDown();
		}
	}.observes('isActive')
})
