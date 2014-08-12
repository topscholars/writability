export default function(text, wordCount) {
	text = this.get(text);
	var words = text.match(/\S+/g);

	if (words.length > wordCount) {
		return words.splice(0,wordCount)
			.join(' ') + '...';
	} else {
		return text;
	}
}
