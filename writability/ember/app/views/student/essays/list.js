import Ember from 'ember';
import ListItemView from './list-item';

export default Ember.View.extend({
    templateName: 'student/essays/list',
    title: null,
    tagName: "section",
    listItem: ListItemView
});
