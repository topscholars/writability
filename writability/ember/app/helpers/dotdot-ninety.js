// Yes of course this needs combined with dotdot-fifty..
// Was able to pass in a 2nd param, but checking it silently broke the helper.
import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(str) {
    if (str) {
        if (str.length > 90) {
            return str.substring(0,90) + '...';
        }
    }
    return str;
});
