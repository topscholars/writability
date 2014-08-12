import Ember from 'ember';

export default Ember.View.extend({
	showNav: false,
	templateName: 'application/student-nav',

	actions: {
		toggleMenu: function() {
			this.toggleProperty('showNav');
		}
	}
});
