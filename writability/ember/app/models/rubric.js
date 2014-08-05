import DS from 'ember-data';
//import FixtureData from 'writability/fixtures/rubric';

var Rubric = DS.Model.extend({
	review: DS.belongsTo('review'),
	name: DS.attr(),
	rubric_associations: DS.hasMany('rubric-association')//, {async: true})
});

//Rubric.reopenClass({
//	FIXTURES: FixtureData
//});

export default Rubric;
