import DetailsListView from 'writability/views/-core/details-list';

export default DetailsListView.extend({
    templateName: 'student/essays/show/applications',
    name: "Applications",
    summaryText: "Click on an application question to exclusively associate it with this essay. Each question must be associated with a single essay.",
    listItemController: "modules/student/essays/show/_app-item"
});