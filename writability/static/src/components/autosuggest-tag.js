App.AutosuggestTagComponent = App.FormSelect2Component.extend({
	formatSelection: function (tag) {
		var categoryEl = $('<span>').addClass('tag-result-category').html(tag.get('category')),
			nameEl = $('<span>').addClass('tag-result-name').html(tag.get('name'))
			$result = $('<div>');

		$result.append(categoryEl);
		$result.append(nameEl);
		return $result;
	},

	formatResult: function (tag) {
		var categoryEl = $('<span>').addClass('tag-result-category').html(tag.get('category')),
			nameEl = $('<span>').addClass('tag-result-name').html(tag.get('name'))
			$result = $('<div>');

		$result.append(categoryEl);
		$result.append(nameEl);
		return $result;
	},

	prompt: 'Tag it.',

	didInsertElement: function () {
		this.setupSelect2Options();
		this.$().width('100%');
		this._super();
	},

	setupSelect2Options: function() {
		this.select2Options = {
			data: {
				results: this.get('data').toArray(),
				text: function(tag) {
					return tag.get('category');
				}
			},
			formatResult: this.formatResult,
			formatSelection: this.formatSelection
		}
	}
});
