import Ember from 'ember';

export default Ember.View.extend({
    templateName: '-core/details',

    //elementId: "details-module",
    tagName: "section",
    classNames: ["module", "details-module"],
    tabsViewClass: ""
});
