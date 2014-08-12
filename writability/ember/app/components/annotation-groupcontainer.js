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
			console.log('annotation-groupcontainer closeAnnotation() action');
			this.set('selectedAnnotation', null);
		},
		deleteAnnotation_GroupContainer: function () {
			console.log('annotation-groupcontainer deleteAnnotation() action');
			this.sendAction('deleteAnnotation_GroupContainer'); // Bubbles to annotation-container.js
		}
	}
});
