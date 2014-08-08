import FormSelect2Component from './form-select2';

export default FormSelect2Component.extend({
	formatSelection: function (tag) {
		var tag_type = tag.get('tag_type').toLowerCase();
		var super_category = tag.get('super_category').toLowerCase(); 
    if (super_category == "rubric") {		// If this is a 'rubric' criteria, then set type as rubric instead of Positive/negative
    	tag_type = super_category;
    }

		var nameEl = $('<span>').addClass('tag-result-name tag-'+tag_type).html(tag.get('name')),
			$result = $('<div>');

		$result.append(nameEl);
		return $result;
	},

	formatResult: function (tag) { //Fired on clicking into the tag input field
		var tag_type = tag.get('tag_type').toLowerCase();
    var super_category = tag.get('super_category').toLowerCase();   // Is "Rubric" as of Aug 5, 2014
    if (super_category == "rubric") {		// If this is a 'rubric' criteria, then set type as rubric instead of Positive/negative
    	tag_type = super_category;
    }

		var categoryEl = $('<span>').addClass('tag-result-category').html(tag.get('category')),
			nameEl = $('<span>').addClass('tag-result-name tag-'+tag_type).html(tag.get('name')),
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
		this.select2Options = {
			data: {
				results: this.get('data').toArray(),
				text: function(tag) {
					return tag.get('category');
				}
			},
			formatResult: this.formatResult,
			formatSelection: this.formatSelection
		};
	}
});
