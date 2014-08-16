import Ember from 'ember';
import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        theme_essays: {serialize: 'no'},
        drafts: {serialize: 'no'},
        choice_group: {serialize: 'no'},
        choice_group_id: {serialize: 'no'},
        requirement_type: {serialize: 'no'},
        special_program: {serialize: 'no'}
    },

    normalize: function(type, hash, prop) {
        if (hash.choice_group === 0) {
        	delete hash.choice_group;
        } else {
            hash.choice_group_id = hash.choice_group;
        }

        if (hash.special_program === 0) {
        	delete hash.special_program;
        }

        return this._super(type, hash, prop);
    },
});
