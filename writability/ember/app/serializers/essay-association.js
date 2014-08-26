import Ember from 'ember';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    normalize: function(type, hash, prop) {

        if (hash.id === null) {
            hash.id = hash.theme_essay_id + "-" + hash.application_essay_id;

            hash.theme_essay = hash.theme_essay_id;
            hash.application_essay = hash.application_essay_id;

            delete hash.theme_essay_id;
            delete hash.application_essay_id;
        }

        return this._super(type, hash, prop);
    }
});
