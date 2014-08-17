import DS from 'ember-data';

export default DS.Model.extend({
	num_required_essays: DS.attr(),
	university: DS.belongsTo('university')
});
