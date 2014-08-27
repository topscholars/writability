import DS from 'ember-data';
//import Ember from 'ember';
//import FixtureData from 'writability/fixtures/rubric-criterion';

var Criterion = DS.Model.extend({
	description: DS.attr(),
  rubriccategory: DS.belongsTo('rubric-category'),
  //name: Ember.computed.alias('rubric_category.name')
});

//RubricCategory.reopenClass({
//	FIXTURES: FixtureData
//});

export default Criterion;
