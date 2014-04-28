App.EssaysController = Ember.ArrayController.extend({
    activeEssay: null,

    setActiveEssay: function (id) {
        activeEssay = id;
        // TODO: Fire event
    }
});
