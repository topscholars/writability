import User from './user';
import DS from 'ember-data';

export default User.extend({
    // properties
    // relationships
    students: DS.hasMany('student', {async: true}),
    reviews: DS.hasMany('review', {async: true}),
    teacher_essays: DS.hasMany('themeEssay', {async: true}),
    invitations: DS.hasMany('invitation', {async: true}),
});
