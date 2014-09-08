import DS from 'ember-data';
//import Ember from 'ember';
//import FixtureData from 'writability/fixtures/rubric-criterion';

var Criterion = DS.Model.extend({
	description: DS.attr('string'),
  essay_template: DS.belongsTo('essayTemplate', {async: true}),
  category: DS.attr('string'),
  rubriccategory: DS.belongsTo('rubric-category'),
  name: DS.attr('string'),
  super_category: DS.attr('string'),
  tag_type: DS.attr('string')
});

//RubricCategory.reopenClass({
//	FIXTURES: FixtureData
//});

export default Criterion;
