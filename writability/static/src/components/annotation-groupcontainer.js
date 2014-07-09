App.AnnotationGroupcontainerComponent = Ember.Component.extend({

	classNames: ['annotation-group'],

	didInsertElement: function() {
		this.$().offset({top: this.get('group.top')});
	},

	actions: {
		selectAnnotation: function (annotation) {
			this.set('selectedAnnotation', annotation);
		},
		closeAnnotation: function () {
			this.set('selectedAnnotation', null);
		}
	}
});
