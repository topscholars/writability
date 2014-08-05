import Essay from './essay';
import DS from 'ember-data';

export default Essay.extend({
    // properties

    // relationships
    university_name: DS.attr(),
    theme_essays: DS.hasMany('themeEssay', {async: true}),
    essay_template: DS.belongsTo('applicationEssayTemplate', {async: true}),
    essayType: 'application'
});
