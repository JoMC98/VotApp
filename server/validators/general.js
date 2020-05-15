exports.checkValues = (object) => {
    var res = {}
    var error = false;
    for (var k of Object.keys(object)) {
        res[k] = object[k] ? true : false
        if (!res[k]) {
            error = true;
        }
    }
    if (!error) {
        return(true)
    } else {
        return(error)
    }
}