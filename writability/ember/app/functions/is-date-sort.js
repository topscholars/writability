export default function (a, b) {
    var regex = /\d{4}-\d{2}-\d{2}/;

    if (a !== undefined && b !== undefined) {
    	return a.match(regex) && b.match(regex);
    }

    return false;
}
