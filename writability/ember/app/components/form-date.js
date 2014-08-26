import Ember from 'ember';

export default Ember.TextField.extend({

	classNames: ['form-date'],
	classNameBindings:['isDraftSettingsBox:draft_review_input'],
	isDraftSettingsBox: false, // Set as true in hbs to add custom class for smaller input size
	formatSubmit: "YYYY-MM-DD",
	min: true,

	placeholder: 'Select Date',

	picker: null,

	updateValue: function() {
		var date = moment(this.get("date"));
		if (date.isValid()) {
			this.set("value", date.format("L"));
			this.get("picker").setDate(date.format("L"));
		} else {
			this.set("value", null);
		}
	}.observes("date"),

	updateDate: function() {
		var date = moment(this.get("value"));
		if (date.isValid()) {
			this.set("date", date.toDate());
		} else {
			this.set("date", null);
		}
	}.observes("value"),

	didInsertElement: function() {
		var picker = new Pikaday({
			field: this.$()[0],
			format: "MM/DD/YYYY"
		});
		this.set("picker", picker);
		this.updateValue();
	},

	willDestroyElement: function(){
		var picker = this.get("picker");
		if (picker) {
			picker.destroy();
		}
		this.set("picker", null);
	}
});
