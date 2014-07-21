import DS from 'ember-data';

export default DS.Model.extend({
    // properties
    text: DS.attr('string'),
    is_draft_approved: DS.attr('boolean'),
    due_date: DS.attr('string'),
    review_type: DS.attr('string'),

    next_states: DS.attr('array', {readOnly: true}),
    state: DS.attr('string'),
    annotations: DS.hasMany('annotation', {async: true}),

    all_annotations_resolved: function() {
        return ! this.get('annotations').isAny('state', 'new');
    }.property('annotations.@each.state'),

    // relationships
    draft: DS.belongsTo('draft'),
    teacher: DS.belongsTo('teacher')
});
