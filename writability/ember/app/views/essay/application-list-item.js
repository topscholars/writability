import Ember from 'ember';

export default Ember.View.extend({
	tagName: 'li',
	classNames: ['tab-list-item'],
	classNameBindings: ['controller.isSelected:selected', 'controller.isUnselected:unselected'],

	click: function() {
		this.get('controller').send('select');
	}
});
