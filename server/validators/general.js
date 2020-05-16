exports.checkRequired = (att, value, errors) => {
    if (!value) {
      errors[att] = "required"
      return false
    }
    return true
}

exports.checkStringsNumbers = (value, res) => {
    for (var i = 0; i<value.length; i++) {
      var c = value.charAt(i)
      if (c != " ") {
        if (isNaN(c)) {
          res.str = true
        } else {
          res.numb = true
        }
      }
    }
}

exports.checkLength = (att, value, longitud, errors) => {
  if (value.length > longitud) {
    errors[att] = "length"
    return false
  }
  return true
}