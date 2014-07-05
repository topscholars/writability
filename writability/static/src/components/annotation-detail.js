App.AnnotationDetailComponent = Ember.Component.extend({

	classNames: ['annotation-detail'],

	didInsertElement: function() {
		this.$().offset({top: this.get('top')});
	}

});
