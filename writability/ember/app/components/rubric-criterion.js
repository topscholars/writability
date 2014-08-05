import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['rubric-criterion'],
	index: function() {
		return this.get('criteria').indexOf(this.get('criterion')) + 1;
	}.property('criteria', 'criterion')
});
