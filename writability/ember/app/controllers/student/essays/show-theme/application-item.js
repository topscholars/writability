import Ember from 'ember';

export default Ember.ObjectController.extend({
	isSelected: Ember.computed.equal('state', 'selected'),
	isUnselected: Ember.computed.equal('state', 'unselected'),

	actions: {
        select: function() {
            this.send('selectApplicationEssay', this.get('model'));
        }
    }
});