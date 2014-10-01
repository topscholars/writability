import Ember from 'ember';
import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {

  // normalize() is hit on a GET
  // Also hit on a PUT, but later at GEt /appli-essay-templates
  normalize: function(type, hash, prop) {
    if (hash.teacher === null) {
      delete hash.teacher;
    }
    return this._super(type, hash, prop);
  },
  serialize: function(record, options) {
    var data = this._super(record, options);
    delete data.teacher;

    return data;
  },

  attrs: {
    // teacher: {serialize: false}      // Doesn't work
    teacher: {deserialize: 'no'}     // Doesn't work
    // teacher: {serialize: 'no'} // Doesn't work
  }
});


// export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
//     attrs: {
//         teacher: {serialize: false}
//     }
// });


// export default ApplicationSerializer.extend({
//     attrs: {
//         teacher: {serialize: false}
//     }
// });



// Below format doesn't work because  'App.' undefined
// App.PersonSerializer = DS.JSONSerializer.extend({
//   attrs: {
//     admin: {serialize: false},
//     occupation: {key: 'career'}
//   }
// });

