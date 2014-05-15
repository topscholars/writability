App.Review = DS.Model.extend({
    // properties
    text: DS.attr('string'),
    is_draft_approved: DS.attr('boolean'),
    due_date: DS.attr('string'),
    review_type: DS.attr('string'),

    next_states: DS.attr('array', {readOnly: true}),
    state: DS.attr('string'),

    // relationships
    draft: DS.belongsTo('draft')
    teacher: DS.belongsTo('teacher')
});