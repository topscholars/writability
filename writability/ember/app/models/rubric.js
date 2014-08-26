import DS from 'ember-data';
import Ember from 'ember';
//import FixtureData from 'writability/fixtures/rubric';

var Rubric = DS.Model.extend({
	review: DS.belongsTo('review'),
	name: DS.attr(),
	rubric_associations: DS.hasMany('rubric-association'),//, {async: true})

  essay_template: DS.belongsTo('essay-template'), //only for below alias
  all_criteria: Ember.computed.alias('essay_template.criteria'),

  impact_criteria: function (key, value) {
    if (arguments.length > 1) { // > 1 args = this is a `set`
      return value;
    } else {
      var model = this;
      var all_criteria = this.get('all_criteria');
      var impact_criteria = [];
      // content, impact, quality, style
      //var peters = this.store.find('criteria', { id: crit.id, name: "Impact" });
      var all_criteria_length = all_criteria.length;
      debugger
      all_criteria.forEach (function(crit, index) {
        var crit_id = crit.id;
        model.store.find('rubric-criterion', crit_id )
          .then( function (crit_obj) {
            var category_name = crit_obj.get('rubriccategory.name').toLowerCase();
            if (category_name == "impact") {
              impact_criteria.push(crit);
            }
            debugger
            if ((index+1) == all_criteria_length) {
              model.set("impact_criteria", impact_criteria);
              debugger
            }
          });
        
      });
      // returns null if the promise doesn't resolve immediately, or 
      // the calculated value if it's ready
      return value;
    }

  }.property('all_criteria')
  //var impact_crit = all_criteria.filterBy('')

  //selectedEssays: function() {
  //  return this.get('content').filterBy('onboarding_is_selected', true);
  //}.property('content.@each.onboarding_is_selected'),
});

//Rubric.reopenClass({
//	FIXTURES: FixtureData
//});

export default Rubric;
