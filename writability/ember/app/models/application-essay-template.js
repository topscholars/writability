import EssayTemplate from './essay-template';
import DS from 'ember-data';

export default EssayTemplate.extend({
    max_words: DS.attr('string'),
    university: DS.belongsTo('university', {async: true}),
    themes: DS.hasMany('theme', {async: true}),
    due_date: DS.attr('string'),
    choice_group: DS.belongsTo('choice-group', {async: true}),
    requirement_type: DS.attr('string')
});
