import DS from 'ember-data';
//import FixtureData from 'writability/fixtures/rubric-criterion';

var Criterion = DS.Model.extend({
	description: DS.attr()
  //rubric_category: DS.attr()
});

//RubricCategory.reopenClass({
//	FIXTURES: FixtureData
//});

export default Criterion;
