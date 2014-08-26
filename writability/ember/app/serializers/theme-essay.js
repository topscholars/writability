import Ember from 'ember';
import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        essay_associations: {serialize: 'no', deserialize: 'records'},
        merged_theme_essays: {serialize: 'id', deserialize: 'id'}
    },
    normalize: function(type, hash, prop) {
        hash.application_essays = [];
        hash.selected_essays = [];
        hash.unselected_essays = [];

        hash.children_essays = hash.merged_theme_essays;

        hash.parent = hash.parent_id === 0 ? null : hash.parent_id;

        return this._super(type, hash, prop);
    },
    serializeAttribute: function(record, json, key, attributes) {
        json.parent_id = record.get('parent');
        if (record.get('parent_id') === 0) {
            record.set('parent_id', null);
        }

        return this._super(record, json, key, attributes);
    }
});
