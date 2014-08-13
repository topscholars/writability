import DS from 'ember-data';

export default DS.Model.extend({
	original: DS.attr(),
	comment: DS.attr(),
	state: DS.attr(),
	tag: DS.belongsTo('tag'),

	review: DS.belongsTo('review', {async: true}),


  /* Methods for Annotation's underlying Tag's type */
	isPositive: function() { // Required because handlebar template can't use an attr's value..
		var model = this;
		var tag_type = model.get('tag.tag_type');
		var result = (tag_type === "POSITIVE" ? true : false);
    return result;
  }.property('tag.tag_type'),

  isRubric: function() { // Redundant methods..
    var model = this;
    var super_category = model.get('tag.super_category');
    var result = (super_category === "Rubric" ? true : false); // This breaks on .toLowerCase() for some reason. 
    return result;
  }.property('tag.super_category'),


  /* Methods for Annotation's state: 1. New     2. Approved (by student)   3. Resolved (by teacher) */
  /* This cannot be 'isNew', because that overrides an internal Ember method.
     When clicking create, this isNew attr returns false ->telling ember that the record exists 
     and causing a PUT instead of POST when creating. */
  isNewAnnotation: function() {
    var state = this.get('state');
    var result = (state === "new" ? true : false);
    return result;
  }.property('state'),

	isResolved: function() {
		var state = this.get('state');
		var result = (state === "resolved" ? true : false);
    return result;
  }.property('state'),

  isApproved: function() {
		var state = this.get('state');
		var result = (state === "approved" ? true : false);
    return result;
  }.property('state'),


  /* Other */
	changeTagObserver: function() {
		var model = this;

		this.store.find('tag', this.get('tagId'))
			.then(function(tag) {
				model.set('tag', tag);
			});
	}.observes('tagId'),

	didCreate: function() {
	    var model = this;

	    this.get('review').then(function (review) {
	    	review.get('annotations').pushObject(model);
	    });
	}
});
