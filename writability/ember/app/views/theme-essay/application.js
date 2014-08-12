import DetailsListView from 'writability/views/-core/details-list';

export default DetailsListView.extend({
    name: "Applications",
    summaryText: "Click on an application question to exclusively associate it with this essay. Each question must be associated with a single essay.",
    listItemController: "essay/application-essay"
});
