export default function (dependentKey, index) {
	return Ember.computed(dependentKey, function(key, value) {
	  if (arguments.length > 1) {
	  	var tempArray = this.get(dependentKey);
	  	tempArray[index] = value;
	    this.set(dependentKey, tempArray);
	    return value;
	  } else {
	    return this.get(dependentKey)[index];
	  }
	});
};
