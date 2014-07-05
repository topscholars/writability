App.AnnotationDetailComponent = Ember.Component.extend(App.Collapsable, {

	classNames: ['annotation-detail'],

	didInsertElement: function() {
		this.$().offset({top: this.get('top')});
	}

});
