import Resolver from 'ember/resolver';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: 'writability', // TODO: loaded via config
  Resolver: Resolver
});

export default App;
