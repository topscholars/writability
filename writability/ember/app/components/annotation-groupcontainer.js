import Ember from 'ember';

export default Ember.Component.extend({

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
		},
		deleteAnnotation_GroupContainer: function (annotation) {
			this.sendAction('deleteAnnotation_GroupContainer', annotation); // Bubbles to annotation-container.js
		}
	}
});
