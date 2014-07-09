/* globals App, DS */
App.Review = DS.Model.extend({
    // properties
    text: DS.attr('string'),
    is_draft_approved: DS.attr('boolean'),
    due_date: DS.attr('string'),
    review_type: DS.attr('string'),

    next_states: DS.attr('array', {readOnly: true}),
    state: DS.attr('string'),
    annotations: DS.hasMany('annotation', {async: true}),

    // This returns all non-approved annotations. Shows up as blank though..
    //active_annotations: function() {
    //    this.get('annotations').then(function (annotations) {
    //        return annotations.rejectBy('state', 'approved');
    //    });
    //}.property('annotations'),

    // relationships
    draft: DS.belongsTo('draft'),
    teacher: DS.belongsTo('teacher')
});
