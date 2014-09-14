import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    dueDateAdvanceDays: 3,

    // properties
    audience: DS.attr('string'),
    context: DS.attr('string'),
    due_date: DS.attr(),
    essay_prompt: DS.attr('string'),
    num_of_drafts: DS.attr('number'),
    topic: DS.attr('string'),
    max_words: DS.attr('number'),
    draft_due_date: DS.attr(null, {readOnly: true}), // Likely needs null changed to 'string'
    next_action: DS.attr('string', {readOnly: true}),
    is_displayed: DS.attr('boolean'),
    state: DS.attr('string'),

    // relationships
    student: DS.belongsTo('student'),
    drafts: DS.hasMany('draft', {async: true}),
    essay_template: DS.belongsTo('essayTemplate', {async: true}),

    autoUpdateDueDate: function() {
        var currentDueDate = moment(this.get('due_date'));

        // Check if currentDueDate is in the past
        if (currentDueDate.isBefore(moment())) {
            var newDueDate = currentDueDate.add('d', this.get('dueDateAdvanceDays'));
            this.set('due_date', newDueDate.format('YYYY-MM-DD'));
        }
    },

    recentDraft: Ember.computed.alias('drafts.lastObject'),

    numberOfStartedDrafts: Ember.computed.alias('drafts.length'),

    teacherRecentReview: Ember.computed.alias('recentDraft.review'),

    draftsWithCompletedReview: Ember.computed.filterBy('drafts', 'reviewState', 'completed'),

    curr_draft_number: function () {
        var curr_draft_number = this.get('draftsWithCompletedReview') + 1;
        return curr_draft_number;
    }.property('draftsWithCompletedReview'),

    studentRecentReview: Ember.computed.alias('draftsWithCompletedReview.lastObject.review'),

    nextActionAwaits: function () {
        var nextAction = this.get('next_action');

        if (nextAction === undefined || nextAction === null) {
            return null;
        }

        if ( nextAction.match(/Review|Approve/)) {
            return 'teacher';
        } else {
            return 'student';
        }
    }.property('next_action', 'state'),

    saveWithDrafts: function() {
      var model = this;
      return this.get('drafts').then(function() {
        model.save();
      });
    },

    isThemeEssay: Ember.computed.equal('essayType', 'theme'),

    is_completed: Ember.computed.equal('state', 'completed')
});
