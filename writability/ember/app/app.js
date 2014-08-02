import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

var inflector = Ember.Inflector.inflector;
inflector.irregular("criterion", "criteria");

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: 'writability', // TODO: loaded via config
  Resolver: Resolver,
  rootElement: '#application-root'
});

loadInitializers(App, 'writability');

export default App;
