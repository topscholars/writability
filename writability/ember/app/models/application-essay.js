import Essay from './essay';
import DS from 'ember-data';

export default Essay.extend({
    // properties

    // relationships
    university_name: DS.attr(),
    theme_essays: DS.hasMany('themeEssay', {async: true}),
    essay_template: DS.belongsTo('applicationEssayTemplate', {async: true}),
    essayType: 'application',

    onboarding_is_selected: DS.attr(),

    is_in_progress: true,

    choice_group: DS.belongsTo('choice-group', {async: true}),
    choice_group_id: DS.attr(),
    special_program: DS.belongsTo('special-program', {async: true}),
    special_program_id: DS.attr(),
    requirement_type: DS.attr('string'),

});
