import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
	grade: DS.attr('number'),
	rubric_category: DS.belongsTo('rubric-category'),
	name: Ember.computed.alias('rubric_category.name')
});
