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
    draft_due_date: DS.attr(null, {readOnly: true}),
    next_action: DS.attr('string', {readOnly: true}),

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

    studentRecentReview: Ember.computed.alias('draftsWithCompletedReview.lastObject.review'),

    nextActionAwaits: function () {
        var nextAction = this.get('next_action');

        if (nextAction === undefined) {
            return null;
        }

        if ( nextAction.match(/Review|Approve/)) {
            return 'teacher';
        } else {
            return 'student';
        }
    }.property('next_action', 'state')
});
