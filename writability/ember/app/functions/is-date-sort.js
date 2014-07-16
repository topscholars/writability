export default function (a, b) {
    var regex = /\d{4}-\d{2}-\d{2}/;

    return a.match(regex) && b.match(regex);
}
