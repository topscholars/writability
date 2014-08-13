import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
	state: DS.attr(),
	application_essay: DS.belongsTo('application-essay')
});
