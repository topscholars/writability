/* globals App, Ember, $, DS */

window.App = Ember.Application.create({
    rootElement: '#application-root',

    // Basic logging, e.g. "Transitioned into 'post'"
    LOG_TRANSITIONS: true,

    // Extremely detailed logging, highlighting every internal
    // step made while transitioning into a route, including
    // `beforeModel`, `model`, and `afterModel` hooks, and
    // information about redirects and aborted transitions
    LOG_TRANSITIONS_INTERNAL: true
});

App.ApplicationController = Ember.ObjectController.extend({

    // required for CurrentUserHelper to set properties
    content: {}
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

Ember.Handlebars.helper('dotdotfifty', function(str) {
    if (str) {
        if (str.length > 50) {
            return str.substring(0,50) + '...';
        }
    }
    return str;
});

Ember.Handlebars.helper('formatDate', function(date) {
    if (date) {
        return moment(date).format("MMM Do, 'YY");//format('LL');
    }
    return date;
});

Ember.Handlebars.helper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
});
//Handlebars.registerHelper('dotdotfifty', function(str) {
//  if (str.length > 50)
//    return str.substring(0,50) + '...';
//  return str;
//});
//

/**
    A replacement for #each that provides an index value (and other helpful
    values) for each iteration. Unless using `foo in bar` format, the item
    at each iteration will be accessible via the `item` variable.

    From: http://mozmonkey.com/2014/03/ember-getting-the-index-in-each-loops/
 
    Simple Example
    --------------
    ```
    {{#eachIndexed bar in foo}}
      {{index}} - {{bar}}
    {{/#eachIndexed}}
    ```

    Helpful iteration values
    ------------------------
    * index: The current iteration index (zero indexed)
    * index_1: The current iteration index (one indexed)
    * first: True if this is the first item in the list
    * last: True if this is the last item in the list
    * even: True if it's an even iteration (0, 2, 4, 6)
    * odd: True if it's an odd iteration (1, 3, 5)
*/
Ember.Handlebars.registerHelper('eachIndexed', function eachHelper(path, options) {
    var keywordName = 'item',
        fn;

    // Process arguments (either #earchIndexed bar, or #earchIndexed foo in bar)
    if (arguments.length === 4) {
          Ember.assert('If you pass more than one argument to the eachIndexed helper, it must be in the form #eachIndexed foo in bar', arguments[1] === 'in');
          Ember.assert(arguments[0] +' is a reserved word in #eachIndexed', $.inArray(arguments[0], ['index', 'index+1', 'even', 'odd']));
          keywordName = arguments[0];

          options = arguments[3];
          path = arguments[2];
          options.hash.keyword = keywordName;
          if (path === '') { path = 'this'; }
    }

    if (arguments.length === 1) {
        options = path;
        path = 'this';
    }

    // Wrap the callback function in our own that sets the index value
    fn = options.fn;
    function eachFn(){
          var keywords = arguments[1].data.keywords,
              view = arguments[1].data.view,
              index = view.contentIndex,
              list = view._parentView.get('content') || [],
              len = list.length;

          // Set indexes
          keywords['index'] = index;
          keywords['index_1'] = index + 1;
          keywords['first'] = (index === 0);
          keywords['last'] = (index + 1 === len);
          keywords['even'] = (index % 2 === 0);
          keywords['odd'] = !keywords['even'];
          arguments[1].data.keywords = keywords;

          return fn.apply(this, arguments);
    }
    options.fn = eachFn;

    // Render
    options.hash.dataSourceBinding = path;
    if (options.data.insideGroup && !options.hash.groupedRows && !options.hash.itemViewClass) {
          new Ember.Handlebars.GroupedEach(this, path, options).render();
    } else {
          return Ember.Handlebars.helpers.collection.call(this, 'Ember.Handlebars.EachView', options);
    }
});
