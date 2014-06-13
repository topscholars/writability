App.IsInArrayCheckboxComponent = Ember.Component.extend({
	target: null,
	list: [],
	isInArray: function() {
		return this.get('list').indexOf(this.get('target')) != -1;
	}.property('list.@each', 'target')
});
