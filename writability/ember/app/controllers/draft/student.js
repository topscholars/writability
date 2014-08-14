import Ember from 'ember';
import DraftController from 'writability/controllers/draft';

export default DraftController.extend({

    needs: ['essay', 'theme-essay'],

    reviewMode: false,

    currentReview: Ember.computed.alias('essay.studentRecentReview'),

    isStudent: true,

    onNewDraftOpened: function () {
        var draft = this.get('model');
        if (draft.get('state') === 'new') {
            draft.set('state', 'in_progress');
            draft.save();
        }
    }.observes('model'),

    refreshAndTransitionEssay: function (draft) {
        var controller = this;

        draft.get('essay').then(function(essay) {
            essay.reload().then(function () {
                var essay_id = draft.get('essay_id'),
                    essay_type = draft.get('essay_type');

                controller.send('alert', 'Draft submitted.', 'success');
                controller.transitionToEssay(essay_type, essay_id);
            });
        });
    },

    transitionToEssay: function (essayType, essayId) {
        if (essayType === 'application') {
            this.transitionToRoute('application-essay', essayId);
        } else if (essayType === 'theme') {
            this.transitionToRoute('theme-essay', essayId);
        }
    },

    actions: {
        /**
         * Respond to next by submitting draft.
         * This requires that all annotations on that draft's review be resolved before submit
         */
        next: function () {
            var annotations_resolved = this.get('model.review.all_annotations_resolved');
            if (annotations_resolved) {
                if (confirm('Are you sure you want to submit this draft?')) {
                    this.updateEssayDueDate().then(function() {
                        var draft = this.get('model');
                        draft.set('state', 'submitted');

                        // Save draft
                        draft.save().then(
                            this.refreshAndTransitionEssay.bind(this)
                        );
                    }.bind(this));
                }
            } else {
                alert ('You must resolve all annotations before you can submit this draft.');
            }
        },

        back: function () {
            // make sure the draft is saved.
            var draft = this.get('model');
            draft.save().then(function (draft) {
                var essay_id = draft.get('essay_id'),
                    essay_type = draft.get('essay_type');

                this.transitionToEssay(essay_type, essay_id);
            }.bind(this));
        }
    }
});
