import Ember from 'ember';
import { autosaveTimout } from 'writability/config';

export default Ember.ObjectController.extend({
    currentDraft: function () {
        return this.draftByMostCurrent(0);
    }.property('drafts'),

    draft_ready_for_review: Ember.computed.equal('recentDraft.state', 'submitted'),

    approveAndSelectTopic: function(model, approvedTopicField) {
        model.set('state', 'in_progress');
        model.set('topic', model.get(approvedTopicField));
        model.save();
    },

    saveEssaySettings: function() {
        this.get('model').save();
    },

    saveEssaySettingsObserver: function () {
        if (this.get('model.isDirty')) {
            Ember.run.debounce(this, this.saveEssaySettings, autosaveTimout);
        }
    }.observes('due_date', 'num_of_drafts'),

    actions: {
        approveProposedTopic: function(model, approvedTopicField) {
            if (confirm('Are you sure you want to approve these topics?')) {
                this.approveAndSelectTopic(model, approvedTopicField);
            }
        },
        update: function(model) {
            if (confirm('Are you sure you want to save these topics?')) {
                model.save();
            }
        },
        mergeEssay: function(model) {
            this.transitionToRoute('student.essays.show.merge');
        },
        splitEssay: function(model) {
            var oldParent = model.get('parent');
            model.set('parent', null);

            model.save().then(function() {
                oldParent.reload();
            });
        },
        reviewDraft: function() {
            var draft = this.get('recentDraft');
            this.transitionToRoute('draft', draft);
        },
        selectApplicationEssay: function(applicationEssayAssociation) {
            applicationEssayAssociation.set('state', 'selected');
            applicationEssayAssociation.save();
        }
    }
});
