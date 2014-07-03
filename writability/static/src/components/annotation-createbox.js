App.AnnotationCreateboxComponent = Ember.Component.extend({
	tagId: Ember.computed.alias('annotation.annotation.tagId'),
	didInsertElement: function() {
		this.$().offset({top: this.get('annotation.offset.top')});
	}
});
