import Ember from 'ember';
import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        theme_essays: {serialize: 'no'},
        draft: {serialize: 'no'}
    }
});
