App.Annotation = DS.Model.extend({
	original: DS.attr(),
	comment: DS.attr(),
	state: DS.attr(),
	tag: DS.belongsTo('tag'),
	review: DS.belongsTo('review', {async: true}),

	tagId: '',

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
