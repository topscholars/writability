import DS from 'ember-data';
//import FixtureData from 'writability/fixtures/rubric-category';

var RubricCategory = DS.Model.extend({
  grade: DS.attr(),
  rubric_category: DS.attr()  // This is the 'Name', e.g. 'Impact'

  /* Draft plan: 
	name: DS.attr(),
	help_text: DS.attr(),
	grade: DS.attr(),
	criteria: DS.hasMany('rubric-criterion', {async: true})
  */
});

//RubricCategory.reopenClass({
//	FIXTURES: FixtureData
//});

export default RubricCategory;
