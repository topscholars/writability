import EssayTemplate from './essay-template';
import DS from 'ember-data';

export default EssayTemplate.extend({
    audience: DS.attr('string'),
    context: DS.attr('string'),
    theme: DS.belongsTo('theme', {async: true})
});
