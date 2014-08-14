import Ember from 'ember';
import Collapsable from 'writability/mixins/collapsable';

//  Container has createbox and multiple groupcontainers, groupcontainers have multiple details
export default Ember.Component.extend(Collapsable, {
	draft: Ember.computed.alias("controllers.draft"),
	
	classNames: ['annotation-detail'],

	didInsertElement: function() {
		this.$().offset({top: this.get('top')});
	},

	actions: {
		resolveAnnotation: function () {
			var annotation = this.get('annotation'),
				component = this;

			annotation.set('state', 'resolved');
			annotation.save().then(function() {
				component.sendAction('closeAnnotation');
			});
		},
		approveAnnotation: function () {
			var annotation = this.get('annotation'),
				component = this;

			annotation.set('state', 'approved');
			annotation.save().then(function() {
				component.sendAction('closeAnnotation');
			});
		},
		closeAnnotation: function () {
			this.sendAction('closeAnnotation');
		},
		// For teacher to delete unwanted annotations during their initial review
		// DO NOT USE TO REMOVE APPROVED ANNOTATIONS - WE WANT THE DATA RECORD
		deleteAnnotation: function() {
			var annotation = this.get('annotation'),
				component = this;
			component.sendAction('deleteAnnotation_Detail', annotation); // Bubbles to annotation-groupcontainer.js
			// Ends up in teacher controller, removes the underline in draft text & destroys Anno record

			component.sendAction('closeAnnotation'); // Sometimes a ghost annotation-detail view shows after deleting.
		}
	}

});
