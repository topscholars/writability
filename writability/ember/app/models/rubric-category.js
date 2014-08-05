import DS from 'ember-data';
//import FixtureData from 'writability/fixtures/rubric-category';

var RubricCategory = DS.Model.extend({
	name: DS.attr(),
	criteria: DS.hasMany('rubric-criterion', {async: true})
});

export default RubricCategory;
