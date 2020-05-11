import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralValidatorService {

  constructor() { }

  checkRequired(att, value, errors) {
    if (!value) {
      errors[att] = "required"
      return false
    }
    return true
  }

  checkStringsNumbers(value, res) {
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

}
