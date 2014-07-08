App.AutosuggestTagComponent = App.FormSelect2Component.extend({
	formatSelection: function (tag) {
		console.log('formatSelection');

		var
			nameEl = $('<span>').addClass('tag-result-name tag-'+tag_type).html(tag.get('name'))
			$result = $('<div>');

		$result.append(nameEl);
		return $result;
	},

	formatResult: function (tag) { //Fired on clicking into the tag input field

		console.log('formatResult');
		var tag_type = tag.get('tag_type').toLowerCase();

		var categoryEl = $('<span>').addClass('tag-result-category').html(tag.get('category')),
			nameEl = $('<span>').addClass('tag-result-name tag-'+tag_type).html(tag.get('name'))
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

	setupSelect2Options: function() { //Fired on hitting comment button. Loops for every tag
		console.log('setupSelect2Options');
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
