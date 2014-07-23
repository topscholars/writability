import DS from 'ember-data';
import FixtureData from 'writability/fixtures/rubric-category';

var RubricCategory = DS.Model.extend({
	description: DS.attr()
});

RubricCategory.reopenClass({
	FIXTURES: FixtureData
});

export default RubricCategory;
