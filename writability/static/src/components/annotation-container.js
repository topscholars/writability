App.AnnotationContainerComponent = Ember.Component.extend({
	actions: {
		hasSavedAnnotation: function(annotation) {
			this.sendAction('hasSavedAnnotation', annotation);
		}
	}
});
