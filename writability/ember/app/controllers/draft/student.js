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
        var controller = this,
            essay = draft.get('essay');

        essay.reload().then(function () {
            controller.transitionToRoute('essay', essay);
        });
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
                var essay_id = draft._data.essay.id;
                // Transition to essays page
                this.transitionToRoute('essay', essay_id);
            }.bind(this));
        }
    }
});
