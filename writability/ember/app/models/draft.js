import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    // properties
    plain_text: DS.attr('string'),
    formatted_text: DS.attr('string'),
    due_date: DS.attr('string'),
    word_count: DS.attr('number'),
    is_final_draft: DS.attr('boolean', {readOnly: true}),
    next_states: DS.attr('array', {readOnly: true}),
    state: DS.attr('string'),

    // relationships
    essay_id: DS.attr(),
    essay_type: DS.attr(),

    essay: function() {
        if (this.get('essay_type') === 'application') {
            return this.store.find('application-essay', this.get('essay_id'));
        } else if (this.get('essay_type') === 'theme') {
            return this.store.find('theme-essay', this.get('essay_id'));
        }
    }.property('essay_type', 'essay_id'),

    essay_is_completed: function() {
      return this.get('essay_state') === 'completed';
    }.property('essay_state'),

    review: DS.belongsTo('review', {async: true}),

    reviewState: Ember.computed.alias('review.state'),

    //// For potential use to return array of IDs
    //active_annotation_ids: function() {
    //    this.get('review').then( function(review) )
    //    if (this.get('essay_type') === 'application') {
    //        return this.store.find('application-essay', this.get('essay_id'));
    //    } else if (this.get('essay_type') === 'theme') {
    //        return this.store.find('theme-essay', this.get('essay_id'));
    //    }
    //}.property('essay_type', 'essay_id'),
});
