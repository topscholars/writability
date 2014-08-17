import ListView from 'writability/views/-core/list';
import ItemView from './universities/add/list-item';
import NewView from './universities/add/new-item';
import OptionsView from './universities/add/options-item';

export default ListView.extend({
	templateName: 'universities',
    title: 'Universities',
    listItem: ItemView,
    newItem: NewView,
    optionsItem: OptionsView
});
