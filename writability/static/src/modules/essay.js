/* globals App, Ember */
App.EssayController = Ember.ObjectController.extend({
    needs: ['essays'],

    // If we're explicit then Ember binding is simpler.
    proposed_topic_0: function () {
        //var deferred = $.Deferred();
        var correct_id = this.get('controllers.essays.selectedEssay.id');
        var topics_t = this.get('controllers.essays.selectedEssay.proposed_topics');
        console.log(topics_t);
        console.log('PROP 0. model id: ' + correct_id );
        return topics_t[0];
        //var correct_essay = this.store.find('themeEssay', correct_id)
        //    .then(function (essay) {
        //        console.log('PROP 0. model id: ' + essay.id );
        //        var topic_o = essay.get('proposed_topics')[0];
        //        return topic_o;
        //    });
        //console.log(correct_essay);


        //return deferred.promise();
        //return this.get('model').get('proposed_topics')[0];
    }.property('proposed_topics'),

    proposed_topic_1: function () {
        var correct_id = this.get('controllers.essays.selectedEssay.id');
        var topics = this.get('controllers.essays.selectedEssay.proposed_topics');
        console.log('PROP 1. model id: ' + correct_id );
        return topics[1];

        //console.log('PROP 1. model id: ' + this.get('model').get('id') );
        //return this.get('model').get('proposed_topics')[1];
    }.property('proposed_topics'),

    /**
     * Helper method to cause observer to fire only once.
     */
    //_proposed_topics_merged: function () {
    //    return this.get('proposed_topic_0') + this.get('proposed_topic_1');
    //}.property('proposed_topic_0', 'proposed_topic_1'),

    //proposedTopicsChanged: function () {
    //    var newProposedTopics = [
    //        this.get('proposed_topic_0'),
    //        this.get('proposed_topic_1')
    //    ];
    //    this.get('model').set('proposed_topics', newProposedTopics);
    //}.observes('_proposed_topics_merged'),

    proposedTopicOneChanged: function () {
        console.log('proposedTopicOneChanged()');
        var pt2 = this.get('model').get('proposed_topics')[1];
        var newProposedTopics = [  this.get('proposed_topic_0'),
                                   pt2                            ]
        this.get('model').set('proposed_topics', newProposedTopics);
    //}.observes('proposed_topics'),
    }.observes('proposed_topic_0'),

    proposedTopicTwoChanged: function () {
        console.log('proposedTopicTwoChanged()');
        var pt1 = this.get('model').get('proposed_topics')[0];
        var newProposedTopics = [  pt1,
                                   this.get('proposed_topic_1')  ]
        this.get('model').set('proposed_topics', newProposedTopics);
    }.observes('proposed_topic_1'),

    getMostRecentDraft: function () {
        return this.get('model').get('drafts').then(function (drafts) {
            return drafts.get('lastObject').get('id');
        });
    },

    actions: {
        openDraft: function () {
            var that = this;
            this.getMostRecentDraft().then(function (id) {
                that.transitionToRoute('draft', id);
            });
        }
    }
});

App.EssayView = App.DetailsView.extend({
    selectedTab: 'overview',

    tabs: [
        {key: 'overview', title: 'Overview'},
        {key: 'application', title: 'Applications'},
        {key: 'archive', title: 'Archive'},
    ],

    didInsertElement: function () {
        Ember.$('#tab-' + this.selectedTab).addClass('is-selected');
    },

    actions: {
        select: function (tabKey) {
            //TODO: make this cleaner
            Ember.$('.tab-header').each(function (index, el) {
                var elID = Ember.$(el).attr('id');
                if (elID === ("tab-" + tabKey)) {
                    Ember.$(el).addClass("is-selected");
                } else {
                    Ember.$(el).removeClass("is-selected");
                }
            });
        }
    }
});

App.EssayOverviewTab = Ember.View.extend({
    name: "Overview",
    templateName: "modules/_essay-details-overview"
});

App.EssayApplicationsTab = Ember.View.extend({
    name: "Applications",
    templateName: "modules/_essay-details-overview"
});

App.EssayArchiveTab = Ember.View.extend({
    name: "Archive",
    templateName: "modules/_essay-details-overview"
});

App.ProposedTopicOne = Ember.View.extend({
    tagName: 'textarea',
    classNames: ['value', 'student-text'],
    //valueBinding: "App.EssayController.proposed_topic_0"

});

App.EssayTabs = Ember.ContainerView.extend({
    /**
     * Create the child views in init so they are recreated on a later
     * transition.
     */
    init: function () {
        this.set('overview', App.EssayOverviewTab.create());
        this.set('application', App.EssayApplicationsTab.create());
        this.set('archive', App.EssayArchiveTab.create());
        this.set('childViews', ['overview']);
        this._super();
    }
});
