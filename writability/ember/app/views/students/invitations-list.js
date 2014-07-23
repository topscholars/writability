import ListView from 'writability/views/-core/list';
import InvitationItemView from './invitation-list-item';
import NewItemView from './invitation-new-item';
import Ember from 'ember';

export default ListView.extend({
    title: 'Invitations',
    listItem: InvitationItemView,
    newItem: NewItemView,
    classNames: ["module", "list-module", 'auto-height'],
});
