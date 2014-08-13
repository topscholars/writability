import ApplicationAdapter from './application';
import DS from 'ember-data';

export default ApplicationAdapter.extend({
	pathForType: function() {
		return 'criteria';
	}
});
