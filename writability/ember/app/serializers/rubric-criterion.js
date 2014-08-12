import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
	typeForRoot: function(key) {
		if (key === 'criterion') {
			return 'rubric-criterion';
		} else {
			return this._super(key);
		}
	}
});
