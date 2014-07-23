import DS from 'ember-data';

export default DS.Model.extend({
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
