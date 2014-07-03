App.AnnotationCreateboxComponent = Ember.Component.extend({
	didInsertElement: function() {
		this.$().offset({top: this.get('annotation.offset.top')});
	}
});
