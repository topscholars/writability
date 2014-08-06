import EssayController from './essay';

export default EssayController.extend({
	actions: {
	    openDraft: function () {
	        var that = this;
	        this.getMostRecentDraft().then(function (draft) {
	            draft.set('state', 'in_progress');
	            draft.save().then(function() {
	                that.transitionToRoute('draft', draft);
	            });
	        });
	    },
	    submitProposedTopics: function(model) {
	        var input = {
	            proposed_topic_0: model.get('proposed_topic_0'),
	            proposed_topic_1: model.get('proposed_topic_1')
	        };
	        var validator = new Validator(input, this.proposedTopicsRules);
	        if (validator.fails()) {
	            alert('You must supply two proposed topics');
	        } else {
	            if (confirm('Are you sure you want to submit these topics?')) {
	                this.submitTopic(model);
	            }
	        }
	    }
	}
});
