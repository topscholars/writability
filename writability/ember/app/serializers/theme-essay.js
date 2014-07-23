import Ember from 'ember';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    normalize: function(type, hash, prop) {
        hash.application_essays = [];
        hash.selected_essays = [];
        hash.unselected_essays = [];
        Ember.$.each(hash.application_essay_states, function(id, value) {
            hash.application_essays.push(id);
            if (value === 'selected') {
                hash.selected_essays.push(id);
            } else if (value === 'not_selected') {
                hash.unselected_essays.push(id);
            }
        });
        hash.children_essays = hash.merged_theme_essays;

        hash.parent = hash.parent_id === 0 ? null : hash.parent_id;

        return this._super(type, hash, prop);
    },
    serializeAttribute: function(record, json, key, attributes) {
        json.parent_id = record.get('parent');
        if (record.get('parent_id') === 0) {
            record.set('parent_id', null);
        }
        this._super(record, json, key, attributes);
    }
});
