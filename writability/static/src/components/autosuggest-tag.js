App.AutosuggestTagComponent = App.FormSelect2Component.extend({
	formatSelection: function (tag) {
		var categoryEl = $('<span>').addClass('tag-result-category').html(tag.category),
			nameEl = $('<span>').addClass('tag-result-name').html(tag.name)
			$result = $('<div>');

		$result.append(categoryEl);
		$result.append(nameEl);
		return $result;
	},

	formatResult: function (tag) {
		var categoryEl = $('<span>').addClass('tag-result-category').html(tag.category),
			nameEl = $('<span>').addClass('tag-result-name').html(tag.name)
			$result = $('<div>');

		$result.append(categoryEl);
		$result.append(nameEl);
		return $result;
	},

	select2Options: {
		data: {
			results: [],
			text: 'category'
		},
		formatResult: this.formatResult,
		formatSelection: this.formatSelection
	},

	prompt: 'Tag it.',

	didInsertElement: function () {
		this.select2Options.data.results = this.get('data');
		Ember.run.scheduleOnce('afterRender', this, 'processChildElements');
	},

	processChildElements: function () {
		this.$().select2(this.get('select2Options'));
	},

	willDestroyElement: function () {
		this.$().select2("destroy");
	}
});
