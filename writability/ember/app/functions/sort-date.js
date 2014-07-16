export default function (a, b) {
    a = moment(a);
    b = moment(b);

    if (a.isSame(b)) {
        return 0;
    }

    return a.isBefore(b) ? -1 : 1;
}
