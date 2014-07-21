import DS from 'ember-data';

import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    normalize: function(type, hash, prop) {
        hash.reviews = hash.reviews.filter(function(value) {
            return value !== null;
        });

        return this._super(type, hash, prop);
    }
});
