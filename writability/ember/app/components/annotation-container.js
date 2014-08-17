import Ember from 'ember';

export default Ember.Component.extend({
	existingAnnotationGroups: function() {
		var groups = Ember.ArrayProxy.create({content:[]});

		this.get('annotations').forEach(function (domAnnotation) {
			var top = domAnnotation.get('offset.top'),
				group = groups.findBy('top', top);

			if (group) {
				group.annotations.pushObject(domAnnotation.get('annotation'));
			} else {
				groups.pushObject({
					top: top,
					annotations: [domAnnotation.get('annotation')]
				});
			}
		});

		return groups;
	}.property('annotations.@each'),
	actions: {
		hasSavedAnnotation: function(annotation) {
			this.sendAction('hasSavedAnnotation', annotation);
		},
		deleteAnnotation_Container: function(annotation) {
			this.sendAction('deleteAnnotation_Container', annotation);
		}
	}
});
