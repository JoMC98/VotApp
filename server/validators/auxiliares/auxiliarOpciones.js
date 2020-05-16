exports.checkOptions = (options) => {
    var errors = {}

    var opt = checkNumberOptions(options, errors)

    if (Object.keys(errors).length == 0) {
        checkDuplicatedOptions(opt, errors)
        if (Object.keys(errors).length == 0) {
            return {valid: true, options: opt}
        } else {
            return {valid: false, errors: errors}
        }
    } else {
        return {valid: false, errors: errors}
    }
}

function checkNumberOptions(options, errors) {
    var opt = []
    for (var op of options) {
      if (op != "") {
        opt.push(op)
      }
    }
    if (opt.length > 6) {
        errors["options"] = "maximum"
    } else if (opt.length >= 2) {
        return opt
    } else {
        errors["options"] = "required"
    }
}

function checkDuplicatedOptions(options, errors) {
    var opt = []
    for (var op of options) {
        if (opt.includes(op)) {
            errors["options"] = "duplicated"
        } 
        else {
            opt.push(op)
        }
    }
}