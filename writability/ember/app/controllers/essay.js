import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['essays'],

    proposedTopicsRules: {
        'proposed_topic_0': 'required',
        'proposed_topic_1': 'required'
    },

    readyToWriteDraft: function() {
        return (this.get('is_in_progress') && this.get('nextActionAwaits') === 'student');
    }.property('is_in_progress', 'nextActionAwaits'),

    currentDraft: function () {
        return this.draftByMostCurrent(0);
    }.property('drafts'),

    draftByMostCurrent: function (version) {
        var drafts = this.get('drafts');
        if (!drafts) {
            return null;
        }

        if (version >= drafts.length) {
            return null;
        }

        return drafts[drafts.length - 1 - version];
    },

    getMostRecentDraft: function () {
        return this.get('model.drafts').then(function (drafts) {
            return drafts.get('lastObject');
        });
    },

    submitTopic: function(model) {
        model.set('state', 'added_topics');
        model.save().then(
            function() {
                console.log('saved');
            },
            function() {
                console.log('error');
            });
    }
});
