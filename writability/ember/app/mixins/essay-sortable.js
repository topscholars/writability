import Ember from 'ember';
import isDateSort from 'writability/functions/is-date-sort';
import sortDate from 'writability/functions/sort-date';
import sortNextAction from 'writability/functions/sort-next-action';

export default Ember.Mixin.create({
	sortProperties: ['due_date', 'next_action'],

	sortFunction: function (a, b) {
	    if (a === null) {
	        if (b === null) {
	            return 0;
	        } else {
	            return 1;
	        }
	    } else if (b === null) {
	        return -1;
	    }

	    if (isDateSort(a, b)) {
	        return sortDate(a, b);
	    } else {
	        return sortNextAction(a, b);
	    }
	}
});

