import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(str) {
    if (str) {
        if (str.length > 50) {
            return str.substring(0,50) + '...';
        }
    }
    return str;
});
