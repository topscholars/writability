import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
	normalize: function(type, hash, prop) {
		if (hash.rubric_category_id) {
			hash.rubric_category = hash.rubric_category_id;
			delete hash.rubric_category_id;
		}
		if (hash.rubric_id) {
			hash.rubric = hash.rubric_id;
			delete hash.rubric_id;
		}

		return this._super(type, hash, prop);
	}
});
