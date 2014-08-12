import EssayController from './essay';

export default EssayController.extend({
	actions: {
	    openDraft: function () {
	    	var essay = this.get('model');

	    	if (essay.get('state') === 'new') {
	    		essay.set('state', 'in_progress');
	    		essay.save();
	    	}

	        this._super();
	    }
	}
});
