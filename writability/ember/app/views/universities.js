import ListView from './-core/list';
import ItemView from './universities/list-item';
import NewView from './universities/new-item';
import OptionsView from './universities/options-item';

export default ListView.extend({
	templateName: 'universities',
    title: 'Universities',
    listItem: ItemView,
    newItem: NewView,
    optionsItem: OptionsView
});
