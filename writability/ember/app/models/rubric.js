import DS from 'ember-data';
import FixtureData from 'writability/fixtures/rubric';

var Rubric = DS.Model.extend({
	categories: DS.hasMany('rubric-category', {async: true})
});

Rubric.reopenClass({
	FIXTURES: FixtureData
});

export default Rubric;
