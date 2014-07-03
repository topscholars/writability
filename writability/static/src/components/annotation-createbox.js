App.AnnotationCreateboxComponent = Ember.Component.extend({
	tagId: Ember.computed.alias('annotation.annotation.tagId'),
	tag: Ember.computed.alias('annotation.annotation.tag'),
	didInsertElement: function() {
		this.$().offset({top: this.get('annotation.offset.top')});
	}
});
