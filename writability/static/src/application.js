/* globals App, Ember, $, DS */

window.App = Ember.Application.create({
    rootElement: '#application-root',

    // Basic logging, e.g. "Transitioned into 'post'"
    LOG_TRANSITIONS: true,

    // Extremely detailed logging, highlighting every internal
    // step made while transitioning into a route, including
    // `beforeModel`, `model`, and `afterModel` hooks, and
    // information about redirects and aborted transitions
    // LOG_TRANSITIONS_INTERNAL: true
});

App.ApplicationController = Ember.ObjectController.extend({

    globalizeUser: function () {
        var user = this.get('model');
        Ember.set('App.CurrentUser');
    }.observes('model'),

    currentUser: function() {
        return this.get('model');
    }

});

App.ApplicationView = Ember.View.extend({
    templateName: 'core/application',

    didInsertElement: function () {
        $('#splash-page').remove();
    }
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
    // Turn Model camel cased class names to dashed urls.
    pathForType: function (type) {
        var dasherized = Ember.String.dasherize(type);
        return Ember.String.pluralize(dasherized);
    },

    namespace: 'api'
});

App.ApplicationSerializer = DS.RESTSerializer.extend({
    // Turn root object snake cased into camel case for Ember.
    typeForRoot: function (root) {
        var camelized = Ember.String.camelize(root);
        return Ember.String.singularize(camelized);
    },
    // Turn camel case into snake case for JSON body.
    serializeIntoHash: function (data, type, record, options) {
        var root = Ember.String.decamelize(type.typeKey);
        data[root] = this.serialize(record, options);
    },
    // Add a readOnly attribute that blocks that attribute from updating
    // to the server.
    serializeAttribute: function(record, json, key, attribute) {
        // TODO: Don't fail silently!
        if (!attribute.options.readOnly) {
            return this._super(record, json, key, attribute);
        }
    }
});

App.ArrayTransform = DS.Transform.extend({

    serialize: function (jsonData) {
        if (jsonData instanceof Array) {
            return jsonData;
        } else {
            // TODO: Throw error.
            return false;
        }
    },

    deserialize: function (externalData) {
        if (externalData instanceof Array) {
            return externalData;
        } else {
            // TODO: Throw error.
            return false;
        }
    }
});
