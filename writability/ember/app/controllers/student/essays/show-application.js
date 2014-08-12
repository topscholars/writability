import Ember from 'ember';

export default Ember.ObjectController.extend({
    currentDraft: function () {
        return this.draftByMostCurrent(0);
    }.property('drafts'),

    draft_ready_for_review: Ember.computed.equal('recentDraft.state', 'submitted'),

    saveEssaySettings: function() {
        this.get('model').save();
    },

    saveEssaySettingsObserver: function () {
        if (this.get('model.isDirty')) {
            Ember.run.debounce(this, this.saveEssaySettings, 500);
        }
    }.observes('due_date', 'num_of_drafts'),

    actions: {
        reviewDraft: function() {
            var draft = this.get('recentDraft');
            this.transitionToRoute('draft', draft);
        }
    }
});
