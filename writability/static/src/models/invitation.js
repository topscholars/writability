/* globals App, DS */
App.Invitation = DS.Model.extend({
    // properties
    email: DS.attr('string'),
    is_registered: DS.attr('boolean'),
    teacher: DS.belongsTo('teacher')
});
