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
			console.log('annotation-detail closeAnnotation Action');
			this.sendAction('closeAnnotation');
		},
		// For teacher to delete unwanted annotations during their initial review
		deleteAnnotation: function() {
			var annotation = this.get('annotation'),
				component = this;
			console.log('annotation-detail deleteAnnotation Action');
			component.sendAction('deleteAnnotation_Detail'); // Bubbles to annotation-groupcontainer.js
			//debugger
			
			//var anno_id = 'annotation-' + annotation.id;
      //var div_container = $('<div>').html(draft.get('formatted_text')); 	// Holds text from draft textarea
      //div_container.find(anno_id).removeAttr('id'); 										// Remove annotation (id) from content
      //var newFormattedText = div_container.html();											// Set draft textarea to new content

      //this.set('formatted_text', newFormattedText);
      //this.set('formatted_text_buffer', newFormattedText);

      ///////// annotation.destroyRecord();

      //Ember.run.debounce(this, this.saveDraft, 5000, true);						// This should make a save, but is not connected to needed module
		}
	}

});
