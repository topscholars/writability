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

    essay_template: Ember.computed.alias('essay.essay_template'),

    essay_is_completed: function() {
      return this.get('essay_state') === 'completed';
    }.property('essay_state'),

    review: DS.belongsTo('review', {async: true}),

    reviewState: Ember.computed.alias('review.state'),

    loadEssayState: function() {
      var model = this;
      return this.get('essay').then(function(e) {
        model.set('essay_state', e.get('state'));
      });
    },

    loadTagsAndCriteria: function() {
        var tags = this.store.find('tag', { is_simple_tag: true } );
        var model = this;

        return this.get('essay').then(function(essay) {
          return essay.get('essay_template').then(function(template) {
            var criteria =  model.store.find('rubric-criterion', {
              essay_template_id: template.get('id')
            });

            return Ember.RSVP.hash({
              tags: tags,
              criteria: criteria
            }).then( function (result) {
              var tags = result.tags.get('content');
              model.set('tags_and_criteria', tags.concat(result.criteria.get('content')));
            });
        });
      });
    }

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
