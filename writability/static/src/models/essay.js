/* globals App, DS */
App.Essay = DS.Model.extend({
    // properties
    audience: DS.attr('string'),
    context: DS.attr('string'),
    due_date: DS.attr('date'),
    essay_prompt: DS.attr('string'),
    num_of_drafts: DS.attr('number'),
    topic: DS.attr('string'),
    max_words: DS.attr('number'),
    draft_due_date: DS.attr('date', {readOnly: true}),
    next_action: DS.attr('string', {readOnly: true}),

    // relationships
    student: DS.belongsTo('student'),
    drafts: DS.hasMany('draft', {async: true}),
    essay_template: DS.belongsTo('essayTemplate', {async: true}),
});

App.ThemeEssay = App.Essay.extend({
    next_states: DS.attr('array', {readOnly: true}),
    proposed_topics: DS.attr('array'),
    state: DS.attr('string'),

    // relationships
    theme: DS.belongsTo('theme', {async: true}),
    application_essays: DS.hasMany('applicationEssay', {async: true}),
    essay_template: DS.belongsTo('themeEssayTemplate', {async: true}),

    proposed_topic_0: App.computed.aliasArrayObject('proposed_topics', 0),
    proposed_topic_1: App.computed.aliasArrayObject('proposed_topics', 1),
    is_in_progress: Ember.computed.equal('state', 'in_progress'),
    is_new_essay: Ember.computed.equal('state', 'new'),
    topicsReadyForApproval: Ember.computed.equal('state', 'added_topics'),
});

App.ApplicationEssay = App.Essay.extend({
    // properties

    // relationships
    theme_essays: DS.hasMany('themeEssay', {async: true}),
    essay_template: DS.belongsTo('applicationEssayTemplate', {async: true})
});
