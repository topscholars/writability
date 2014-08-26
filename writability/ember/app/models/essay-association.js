import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
	state: DS.attr(),
	theme_essay: DS.belongsTo('theme-essay'),
	application_essay: DS.belongsTo('application-essay')
});
