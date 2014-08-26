import DS from 'ember-data';
import Ember from 'ember';
//import FixtureData from 'writability/fixtures/rubric';

var Rubric = DS.Model.extend({
	review: DS.belongsTo('review'),
	name: DS.attr(),
	rubric_associations: DS.hasMany('rubric-association'),//, {async: true})

  essay_template: DS.belongsTo('essay-template'), //only for below alias
  all_criteria: Ember.computed.alias('essay_template.criteria'),

  impact_criteria: function () {
    var all_criteria = this.get('all_criteria');
    var impact_criteria = [];
    // content, impact, quality, style
    all_criteria.forEach (function(crit) {
      var category_name = '';
      crit.get('rubriccategory')
        .then( function (category) {
          debugger
          category_name = category.name.toLowerCase();
          if (category_name == "impact") {
            impact_criteria.push(crit);
          }
        });
    });

  }.property('all_criteria')
    //var impact_crit = all_criteria.filterBy('')
    //return 
  

  //  selectedEssays: function() {
  //  return this.get('content').filterBy('onboarding_is_selected', true);
  //}.property('content.@each.onboarding_is_selected'),


});

//Rubric.reopenClass({
//	FIXTURES: FixtureData
//});

export default Rubric;
