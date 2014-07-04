App.AnnotationGroupcontainerComponent = Ember.Component.extend({
	classNames: ['annotation-group'],
	didInsertElement: function() {
		console.log(this.get('group'));
		this.$().offset({top: this.get('group.top')});
	}
});
