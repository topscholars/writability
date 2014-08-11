import Ember from 'ember';
import DomAnnotation from 'writability/models/dom-annotation';
import { autosaveTimout } from 'writability/config';

export default Ember.ObjectController.extend({

    rubric: Ember.computed.alias('review.rubric'),
    student: Ember.computed.alias('essay.student'),

    isStudent: false,
    isTeacher: false,

    annotations: Ember.computed.alias('review.annotations'),

    formatted_text_buffer: '',

    domAnnotations: function() {
        var controller = this;

        if (this.get('annotations')) {
            return this.get('annotations').map(function(annotation) {
                return controller.createDomAnnotation(annotation);
            });
        }

        else {
            return [];
        }
    }.property('annotations.@each'),

    createDomAnnotation: function(annotation) {
        var annotationOffset = {top: 159, left: 0};

        return DomAnnotation.create({
            offset: annotationOffset,
            annotation: annotation
        });
    },

    saveDraft: function() {
        var draft = this.get('model');
        if (draft.get('isDirty')) {
            draft.save().then(this.onSuccess, this.onFailure);
        }
    },

    formattedTextObserver: function () {
        Ember.run.debounce(this, this.saveDraft, autosaveTimout, true);
    }.observes('formatted_text'),

    onSuccess: function () {
        console.log("Saved draft to server.");
    },

    onFailure: function () {
        console.log("Failure to sync draft to server.");
    },

    updateEssayDueDate: function() {
        var essay = this.get('essay');

        essay.autoUpdateDueDate();

        return essay.save();
    },

    actions: {
        /**
         * When the user started writing make sure the server is in sync.
         */
        startedWriting: function (cb) {
            var draft = this.get('model');
            draft.reload().then(cb, this.onFailure);
        },
    }
});
