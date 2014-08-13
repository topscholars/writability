import Essay from './essay';
import aliasArrayObject from '../computed/alias-array-object';
import Ember from 'ember';
import DS from 'ember-data';

export default Essay.extend({
    next_states: DS.attr('array', {readOnly: true}),
    proposed_topics: DS.attr('array'),

    // relationships
    theme: DS.belongsTo('theme', {async: true}),
    essay_associations: DS.hasMany('essay-association', {readOnly: true}),
    selected_essays: DS.attr('array'),
    unselected_essays: DS.attr('array'),

    essay_template: DS.belongsTo('themeEssayTemplate', {async: true}),
    merged_theme_essays: DS.hasMany('themeEssay', {
        inverse: 'parent'
    }),

    parent: DS.belongsTo('themeEssay', {
        inverse: 'merged_theme_essays'
    }),

    proposed_topic_0: aliasArrayObject('proposed_topics', 0),
    proposed_topic_1: aliasArrayObject('proposed_topics', 1),
    is_in_progress: Ember.computed.equal('state', 'in_progress'),
    is_new_essay: Ember.computed.equal('state', 'new'),
    topicsReadyForApproval: Ember.computed.equal('state', 'added_topics'),

    essayType: 'theme'
});
