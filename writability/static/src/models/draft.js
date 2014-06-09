/* globals App, DS */
App.Draft = DS.Model.extend({
    // properties
    plain_text: DS.attr('string'),
    formatted_text: DS.attr('string'),
    due_date: DS.attr('string'),
    word_count: DS.attr('number'),
    is_final_draft: DS.attr('boolean'),
    next_states: DS.attr('array', {readOnly: true}),
    state: DS.attr('string'),

    // relationships
    essay: DS.belongsTo('themeEssay'), // TODO: need this for essay.theme
    review: DS.belongsTo('review', {async: true})
});
