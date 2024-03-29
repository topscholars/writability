/* globals App, DS */
App.User = DS.Model.extend({
    // properties
    email: DS.attr('string'),
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
    roles: DS.hasMany('role', {async: true, readOnly: true}),
    state: DS.attr('string'),

    // computed properties
    name: function () {
        return this.get('first_name') + ' ' + this.get('last_name');
    }.property('first_name', 'last_name'),

    isTeacher: function () {
        return this.get('roles').isAny('name', 'teacher');
    }.property('roles'),

    isStudent: function () {
        return this.get('roles').isAny('name', 'student');
    }.property('roles')
});

App.TeacherSerializer = App.ApplicationSerializer.extend({
    normalize: function(type, hash, prop) {
        hash.reviews = hash.reviews.filter(function(value) {
            return value !== null;
        });

        return this._super(type, hash, prop);
    }
});

App.Teacher = App.User.extend({
    // properties
    // relationships
    students: DS.hasMany('student', {async: true}),
    reviews: DS.hasMany('review', {async: true}),
    teacher_essays: DS.hasMany('themeEssay', {async: true}),
    invitations: DS.hasMany('invitation', {async: true}),
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
    universities: DS.hasMany('university', {async: true}), // Use async true or ember expects data to already be there
    roles: DS.attr(null, {readOnly: true})
});
