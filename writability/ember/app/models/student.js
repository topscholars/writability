import User from './user';
import Ember from 'ember';
import DS from 'ember-data';

export default User.extend({
    // properties
    //essays: function() {
    //    return this.get('themeEssays');     // Later we'll use this method to return all essays.
    //}.property('themeEssay.@each'),

    // relationships
    teacher: DS.belongsTo('teacher'),
    essays: DS.hasMany('essays', {async: true}),
    theme_essays: DS.hasMany('themeEssay', {async: true}),
    application_essays: DS.hasMany('applicationEssay', {async: true}),
    universities: DS.hasMany('university', {async: true}), // Use async true or ember expects data to already be there
    roles: DS.attr(null, {readOnly: true}),
    onboarded: DS.attr('boolean'),

    all_essays: function () {
        var model = this;
        var promise = new Ember.RSVP.Promise(function(resolve) {
            Ember.RSVP.all([
                model.get('theme_essays'),
                model.get('application_essays')
            ]).then(function(data) {
                resolve(data[0].content.concat(data[1].content));
            });
        });
        return DS.PromiseArray.create({promise: promise});
    }.property('theme_essays', 'application_essays')
});
