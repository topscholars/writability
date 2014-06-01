/* globals Ember, App */
App.DraftController = Ember.ObjectController.extend({

    formattedTextObserver: function () {
        var draft = this.get('model');
        if (draft.get('isDirty')) {
            draft.save().then(this.onSuccess, this.onFailure);
        }
    }.observes('formatted_text'),

    onSuccess: function () {
        console.log("Saved draft to server.");
    },

    onFailure: function () {
        console.log("Failure to sync draft to server.");
    },

    actions: {
        /**
         * When the user started writing make sure the server is in sync.
         */
        startedWriting: function (cb) {
            var draft = this.get('model');
            draft.reload().then(cb, this.onFailure);
        },
        /*
         * Clicking the Details / Review button toggles the current displayed
         * item.
         */
        editorToggle: function () {
            alert("Hello");
        },

        /**
         * Respond to next action from header by confirming with student and
         * sending draft to the teacher.
         */
        next: function () {
            // TODO XXX: Add modal confirmation dialog with callbacks.
            // Change draft state to "submitted"
            var draft = this.get('model');
            draft.set('state', 'submitted');
            // Save draft
            draft.save().then(function (draft) {
                var essay_id = draft._data.essay.id;
                // Transition to essays page
                this.transitionToRoute('essay', essay_id);
            }.bind(this));
        },

        back: function () {
            // make sure the draft is saved.
            var draft = this.get('model');
            draft.save().then(function (draft) {
                var essay_id = draft._data.essay.id;
                // Transition to essays page
                this.transitionToRoute('essay', essay_id);
            }.bind(this));
        }
    },
});

App.DraftView = App.EditorView.extend({
    templateName: 'modules/draft',
});
