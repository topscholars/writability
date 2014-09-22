import Ember from 'ember';

function dateWithTime(date, time) {
  return moment(date).startOf("day")
            .add({minutes: time}).toDate();
}

export default Ember.Component.extend({
  showDate: true,
  showTime: true,
  updateValue: function() {

    var newDate = this.getWithDefault("date", this.get("value")),
        newValue = newDate ? dateWithTime(newDate, this.get("time")) : null;

    this.set("value", newValue);
  },
  dateDidChange: function() {
    this.updateValue();
  }.observes("date"),
  timeDidChange: function() {
    this.updateValue();
  }.observes("time"),
  setPickerValue: function(selector, format) {
    if(Ember.isNone(this.get("value"))) { return; }
    this.$(selector).attr("data-value",
      moment(this.get("value")).format(format));
  },
  valueDidChange: function() {
  }.observes("value"),
  didInsertElement: function() {
    var component = this;

    this.setPickerValue(".date-picker", "YYYY/MM/DD");
    this.setPickerValue(".time-picker", "HH:mm");

    var dateInput = this.$(".date-picker").pickadate({
                      format: 'mmm dd, yyyy',
                      formatSubmit: 'yyyy/mm/dd',
                      onSet: function(set) {
                        component.set("date", set.select);
                      }
                    }),
        timeInput = this.$(".time-picker").pickatime({
                      format: 'h:i A',
                      formatSubmit: 'HH:i',
                      onSet: function(set) {
                        component.set("time", set.select);
                      }
                    });
  }
});
