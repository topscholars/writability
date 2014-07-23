import Ember from 'ember';

export default Ember.View.extend({
    templateName: '-core/list',
    title: null,
    //sections: [],
    listItem: "",
    //elementId: "list-module",  // No id, could have multiple on page.
    tagName: "section",
    classNames: ["module", "list-module"]
});
