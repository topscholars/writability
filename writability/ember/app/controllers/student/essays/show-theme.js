import Ember from 'ember';

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
            Ember.run.debounce(this, this.saveEssaySettings, 500);
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
        selectApplicationEssay: function(applicationEssay) {
            var newSelectedEssays = this.get('model.selected_essays').concat([applicationEssay.id]);
            this.set('model.selected_essays', newSelectedEssays);

            var selectApplicationEssayUrl = '/api/theme-essays/' + this.get('model.id') + '/select-application-essay/' + applicationEssay.get('application_essay.id');
            var data = {};
            data[applicationEssay.id] = 'selected';

            var selectApplicationEssayPromise = new Ember.RSVP.Promise(function(resolve) {
                Ember.$.ajax({
                    url: selectApplicationEssayUrl,
                    method: 'PUT',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(data)
                }).then(function(data) { resolve(); });
            });
        }
    }
});
