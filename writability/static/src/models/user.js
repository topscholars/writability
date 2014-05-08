/* globals App, DS */
App.User = DS.Model.extend({
    // properties
    email: DS.attr('string'),
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
});

App.Teacher = App.User.extend({
    // properties
    // relationships
    students: DS.hasMany('student')
});

App.Student = App.User.extend({
    // properties
    // relationships
    teacher: DS.belongsTo('teacher'),
    essays: DS.hasMany('essay'),
    universities: DS.hasMany('university', {async: true})
});
