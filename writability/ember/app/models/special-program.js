import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr(),
	university: DS.belongsTo('university'),
	description: DS.attr(),
	sp_id: DS.attr()
});
