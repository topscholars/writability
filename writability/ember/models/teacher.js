import User from './user';

export default User.extend({
    // properties
    // relationships
    students: DS.hasMany('student', {async: true}),
    reviews: DS.hasMany('review', {async: true}),
    teacher_essays: DS.hasMany('themeEssay', {async: true}),
    invitations: DS.hasMany('invitation', {async: true}),
});
