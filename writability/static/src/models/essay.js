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

App.ThemeEssaySerializer = App.ApplicationSerializer.extend({
    normalize: function(type, hash, prop) {
        hash.application_essays = [];
        hash.selected_essays = [];
        hash.unselected_essays = [];
        $.each(hash.application_essay_states, function(id, value) {
            hash.application_essays.push(id);
            if (value == 'selected') {
                hash.selected_essays.push(id);
            } else if (value == 'not_selected') {
                hash.unselected_essays.push(id);
            }
        });
        hash.children_essays = hash.merged_theme_essays;

        hash.parent = hash.parent_id == 0 ? null : hash.parent_id;

        return this._super(type, hash, prop);
    },
    serializeAttribute: function(record, json, key, attributes) {
        json.parent_id = record.get('parent');
        if (record.get('parent_id') === 0) {
            record.set('parent_id', null);
        }
        this._super(record, json, key, attributes);
    }
});

App.ThemeEssay = App.Essay.extend({
    next_states: DS.attr('array', {readOnly: true}),
    proposed_topics: DS.attr('array'),
    state: DS.attr('string'),

    // relationships
    theme: DS.belongsTo('theme', {async: true}),
    application_essays: DS.hasMany('applicationEssay', {async: true}),
    selected_essays: DS.attr('array'),
    unselected_essays: DS.attr('array'),

    essay_template: DS.belongsTo('themeEssayTemplate', {async: true}),
    merged_theme_essays: DS.hasMany('themeEssay', {
        inverse: 'parent'
    }),

    parent: DS.belongsTo('themeEssay', {
        inverse: 'merged_theme_essays'
    }),

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
