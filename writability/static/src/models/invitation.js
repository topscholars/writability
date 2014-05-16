/* globals App, DS */
App.Invitation = DS.Model.extend({
    // properties
    id: DS.attr('integer'),
    email: DS.attr('string'),
    is_registered: DS.attr('boolean'),
    teacher: DS.belongsTo('teacher')
});
