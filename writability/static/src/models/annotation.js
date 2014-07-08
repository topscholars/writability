App.Annotation = DS.Model.extend({
	original: DS.attr(),
	comment: DS.attr(),
	state: DS.attr(),
	tag: DS.belongsTo('tag'),

	review: DS.belongsTo('review', {async: true}),

	isPositive: function() { // Required because handlebar template can't use an attr's value..
		var model = this;
		var tag_type = model.get('tag.tag_type'); 
		var result = (tag_type == "POSITIVE" ? true : false);
    return result;
  }.property('tag.tag_type'),

	isResolved: function() { // Required because handlebar template can't use an attr's value..
		var state = this.get('state'); 
		var result = (state == "resolved" ? true : false);
    return result;
  }.property('state'),

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
	    })
	}
});
