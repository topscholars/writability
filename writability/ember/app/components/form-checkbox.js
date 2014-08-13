import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['form-checkbox'],
	click: function() {
		this.toggleProperty('checked');
	}
});
