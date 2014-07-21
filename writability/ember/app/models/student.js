import User from './user';
import DS from 'ember-data';

export default User.extend({
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
