import AuthenticatedRoute from './authenticated';
import Ember from 'ember';

export default AuthenticatedRoute.extend({
    activate: function () {
        this._super();
        if (this.get('currentUser').get('isStudent')) {
            this.controllerName = 'draft/student';
        } else {
            this.controllerName = 'draft/teacher';
        }
    },

    model: function (params) {
        this._assert_authorized(params.id);
        return this.store.find('draft', params.id);
    },

    setupController: function(controller, model) {
        controller.set('model', model); //Required boilerplate
        // controller.set('backDisabled', true);
        // controller.set('nextDisabled', true); // Use same for next button in other views
        if (this.get('currentUser.isStudent')) {
            controller.set('nextText', 'Send to Teacher');
        } else {
            controller.set('nextText', 'Submit Review');
        }
    },

    renderTemplate: function () {
        this.render('layouts/editor');
        this.render('nav-header', {outlet: 'header'});
        this.render({
            controller: this.controllerName,
            into: 'layouts/editor',
            outlet: 'editor-module'
        });
    },

    _assert_authorized: function (id) {
        if (this.get('currentUser').get('isStudent')) {
            this._assert_students_draft(id);
        } else {
            this._assert_teachers_review(id);
        }
    },

    _assert_students_draft: function (id) {
        var route = this;
        Ember.RSVP.Promise.all([
            route.get('currentStudent').get('theme_essays'),
            route.store.find('draft', id)
        ]).then(function (values) {
            var theme_essays = values[0];
            var draft = values[1];
            var essay_id = draft._data.essay.id;

            if (!theme_essays.isAny('id', essay_id)) {
                route.transitionTo('error.unauthorized');
            }
        });
    },

    _assert_teachers_review: function (id) {
        var route = this;
        Ember.RSVP.Promise.all([
            route.get('currentTeacher.reviews'),
            route.store.find('draft', id)
        ]).then(function (values) {
            var reviews = values[0];
            var draft = values[1];
            var review_id = draft.get('review.id');

            if (review_id && !reviews.isAny('id', review_id)) {
                route.transitionTo('error.unauthorized');
            }
        });
    }
});
