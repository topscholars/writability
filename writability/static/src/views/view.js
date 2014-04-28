App.ListView = Ember.View.extend({
    templateName: 'modules/list',
    title: null,
    sections: [],
    listItem: ""
});

App.EssaysView = App.ListView.extend({
    title: 'Essays',
    sections: ['To do', 'Not to do'],
    listItem: "partials/essay-list-item"
});

App.DetailsView = Ember.View.extend({
    templateName: 'modules/details',
});

App.EssayView = App.DetailsView.extend({
});
