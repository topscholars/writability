import Ember from 'ember';
import Collapsable from 'writability/mixins/collapsable';

export default Ember.Component.extend(Collapsable, {
	tagId: Ember.computed.alias('annotation.annotation.tagId'),

	tag: Ember.computed.alias('annotation.annotation.tag'),

	comment: Ember.computed.alias('annotation.annotation.comment'),

	offsetHasChanged: function() {
		this.setElementOffset();
	}.observes('annotation.offset'),

	didInsertElement: function() {
		this.setElementOffset();
	},

	setElementOffset: function() {
		this.$().offset({top: this.get('annotation.offset.top')});
	},

	actions: {
		saveAnnotation: function() {
			var component = this;
			this.get('annotation.annotation').save().then(function(annotation) {
				component.sendAction('hasSavedAnnotation', annotation);
			});
		}//,
		//cancelAnnotation: function() {
		// Close currently open createbox
		// Remove #annotation-in-progress
		//}
	}
});
