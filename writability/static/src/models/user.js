/* globals App, DS */
App.User = DS.Model.extend({
    // properties
    email: DS.attr('string'),
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
    roles: DS.hasMany('role', {async: true}),
    state: DS.attr('string'),

    // computed properties
    isTeacher: function () {
        return this.get('roles').isAny('name', 'teacher');
    }.property('roles'),

    isStudent: function () {
        return this.get('roles').isAny('name', 'student');
    }.property('roles')
});

App.Teacher = App.User.extend({
    // properties
    // relationships
    students: DS.hasMany('student', {async: true}),
    reviews: DS.hasMany('review', {async: true}),
    teacher_essays: DS.hasMany('themeEssay', {async: true})
});

App.Student = App.User.extend({
    // properties
    //essays: function() {
    //    return this.get('themeEssays');     // Later we'll use this method to return all essays.
    //}.property('themeEssay.@each'),

    // relationships
    teacher: DS.belongsTo('teacher'),
    //essays: DS.hasMany('themeEssay', {async: true}),
    theme_essays: DS.hasMany('themeEssay', {async: true}),
    application_essays: DS.hasMany('applicationEssay', {async: true}),
    universities: DS.hasMany('university', {async: true}) // Use async true or ember expects data to already be there
});
