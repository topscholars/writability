App.IsInArrayCheckboxComponent = Ember.Component.extend({
	target: null,
	list: [],
	isInArray: function() {
		var target = parseInt(this.get('target')),
			list = this.get('list');

		return (list.indexOf(target) != -1) || (list.indexOf(target.toString()) != -1);
	}.property('list.@each', 'target')
});
