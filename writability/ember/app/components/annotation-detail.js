import Ember from 'ember';
import Collapsable from 'writability/mixins/collapsable';

export default Ember.Component.extend(Collapsable, {

	classNames: ['annotation-detail'],

	didInsertElement: function() {
		this.$().offset({top: this.get('top')});
	},

	actions: {
		resolveAnnotation: function () {
			var annotation = this.get('annotation'),
				component = this;

			annotation.set('state', 'resolved');
			annotation.save().then(function() {
				component.sendAction('closeAnnotation');
			});
		},
		approveAnnotation: function () {
			var annotation = this.get('annotation'),
				component = this;

			annotation.set('state', 'approved');
			annotation.save().then(function() {
				component.sendAction('closeAnnotation');
			});
		},
		closeAnnotation: function () {
			this.sendAction('closeAnnotation');
		}
	}

});
