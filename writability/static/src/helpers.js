App.computed = {};

App.computed.aliasArrayObject = function (dependentKey, index) {
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

App.isDateSort = function (a, b) {
    var regex = /\d{4}-\d{2}-\d{2}/;

    return a.match(regex) && b.match(regex)
};

App.sortDate = function (a, b) {
    a = moment(a);
    b = moment(b);

    if (a.isSame(b)) {
        return 0
    }

    return a.isBefore(b) ? -1 : 1;
};

App.sortNextAction = function (a, b) {
    return Ember.compare(a,b);
};
