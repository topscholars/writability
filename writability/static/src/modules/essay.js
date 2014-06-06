/* globals App, Ember */
App.EssayController = Ember.ObjectController.extend({
    needs: ['essays'],

    proposedTopicsRules: {
        'proposed_topic_0': 'required',
        'proposed_topic_1': 'required'
    },

    currentDraft: function () {
        return this.draftByMostCurrent(0);
    }.property('drafts'),

    currentReviewWithState: function (state) {
        return this.get('drafts')
            .then(function (drafts) {
                var reviewPromises = [];
                drafts.forEach(function (item, index) {
                    var reviewPromise = item.get('review');
                    if (reviewPromise) {
                        reviewPromises.push(reviewPromise);
                    }
                });
                return Ember.RSVP.all(reviewPromises);
            })
            .then(function (reviews) {
                var reviewsWithGoodState = reviews.filterBy('state', state);
                var numOfGoodReviews = reviewsWithGoodState.length;
                if (numOfGoodReviews > 0) {
                    return reviewsWithGoodState[numOfGoodReviews - 1];
                } else {
                    return null;
                }
            });
    },

    draftByMostCurrent: function (version) {
        var drafts = this.get('drafts');
        if (!drafts) {
            return null;
        }

        if (version >= drafts.length) {
            return null;
        }

        return drafts[drafts.length - 1 - version];
    },

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

    // proposedTopicOneChanged: function () {
    //     console.log('proposedTopicOneChanged()');
    //     var pt2 = this.get('model').get('proposed_topics')[1];
    //     var newProposedTopics = [  this.get('proposed_topic_0'),
    //                                pt2                            ]
    //     this.get('model').set('proposed_topics', newProposedTopics);
    // //}.observes('proposed_topics'),
    // }.observes('proposed_topic_0'),

    // proposedTopicTwoChanged: function () {
    //     console.log('proposedTopicTwoChanged()');
    //     var pt1 = this.get('model').get('proposed_topics')[0];
    //     var newProposedTopics = [  pt1,
    //                                this.get('proposed_topic_1')  ]
    //     this.get('model').set('proposed_topics', newProposedTopics);
    // }.observes('proposed_topic_1'),

    getMostRecentDraft: function () {
        return this.get('model').get('drafts').then(function (drafts) {
            return drafts.get('lastObject').get('id');
        });
    },

    submitTopic: function(model) {
        model.set('state', 'added_topics');
        model.save().then(
            function() {
                console.log('saved');
            },
            function() {
                console.log('error');
            });
    },

    actions: {
        openDraft: function () {
            var that = this;
            this.getMostRecentDraft().then(function (id) {
                that.transitionToRoute('draft', id);
            });
        },
        submitProposedTopics: function(model) {
            var input = {
                proposed_topic_0: model.get('proposed_topic_0'),
                proposed_topic_1: model.get('proposed_topic_1')
            };
            var validator = new Validator(input, this.proposedTopicsRules);
            if (validator.fails()) {
                alert('You must supply two proposed topics');
            } else {
                if (confirm('Are you sure you want to submit these topics?')) {
                    this.submitTopic(model);
                }
            }
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

App.EssayView = App.DetailsView.extend({
    selectedTab: 'overview',
    tabView: App.EssayTabs,

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

App.ThemeEssayController = App.EssayController.extend({});
