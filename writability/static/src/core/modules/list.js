App.ListView = Ember.View.extend({
    templateName: 'core/modules/list',
    title: null,
    //sections: [],
    listItem: ""
});

App.ListItem = Ember.View.extend({
    tagName: "li",
    classNames: ["list-item"],
});

App.ThinListItem = App.ListItem.extend({
    classNames: ["thin-list-item"]
});

App.ThinNewItem = App.ThinListItem.extend({
    classNames: ['new-item']
});

App.ThickListItem = App.ListItem.extend({
    classNames: ["thick-list-item"]
});
