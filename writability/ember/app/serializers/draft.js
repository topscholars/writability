import Ember from 'ember';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    normalize: function(type, hash, prop) {
        hash.essay_id = hash.essay;
        delete hash.essay;

        return this._super(type, hash, prop);
    },
    serialize: function(record, options) {
    	var data = this._super(record, options);
    	data.essay = data.essay_id;
    	delete data.essay_id;

    	return data;
    },
    attrs: {
        essay: {deserialize: 'no'}
    }
});
