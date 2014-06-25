App.IsInArrayCheckboxComponent = Ember.Component.extend({
	target: null,
	list: [],
	isInArray: function() {
		var target = this.get('target'),
			list = this.get('list');

		debugger;

		return (list.indexOf(target) != -1) || (list.indexOf(target.toString()) != -1);
	}.property('list.@each', 'target')
});
