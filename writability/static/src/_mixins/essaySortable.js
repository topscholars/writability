App.EssaySortable = Ember.Mixin.create({
	sortProperties: ['due_date', 'next_action'],

	sortFunction: function (a, b) {
	    if (a !== null) {
	        console.log(a);
	    }
	    if (a === null) {
	        if (b === null) {
	            return 0;
	        } else {
	            return 1;
	        }
	    } else if (b === null) {
	        return -1;
	    }

	    if (App.isDateSort(a, b)) {
	        return App.sortDate(a, b);
	    } else {
	        return App.sortNextAction(a, b);
	    }
	}
});
