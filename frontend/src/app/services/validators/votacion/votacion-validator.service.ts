import { Injectable } from '@angular/core';
import { GeneralValidatorService } from '../general/general-validator.service';

@Injectable({
  providedIn: 'root'
})
export class VotacionValidatorService {

  constructor(private generalValidator: GeneralValidatorService) { }

  async checkDatos(votacion) {
    return await new Promise((resolve, reject) => {
      var errors = {}
      this.generalValidator.checkRequired("pregunta", votacion.pregunta, errors)
      this.generalValidator.checkRequired("departamento", votacion.departamento, errors)
      this.generalValidator.checkRequired("f_votacion", votacion.f_votacion, errors)
      this.generalValidator.checkRequired("ambito", votacion.ambito, errors)
      
      if (Object.keys(errors).length == 0) {
        resolve(true)
      } else {
        reject(errors)
      }
    })
  }

  async checkParticipants(participants) {
    return await new Promise((resolve, reject) => {
      var errors = {}

      if (participants.length < 3) {
        reject(false)
      } else {
        resolve(true)
      }
    })
  }

  async checkOptions(options) {
    return await new Promise((resolve, reject) => {
      var errors = {}

      var opt = this.check2Options(options, errors)
      this.checkDuplicatedOptions(opt, errors)
      
      if (Object.keys(errors).length == 0) {
        resolve(opt)
      } else {
        reject([errors, opt])
      }
    })
  }

  check2Options(options, errors) {
    var opt = []
    for (var op of options) {
      if (op != "") {
        opt.push(op)
      }
    }
    if (opt.length >= 2) {
      return opt
    } else if (opt.length == 1) {
      errors["options"] = "required"
      return [opt[0], ""]
    } else {
      errors["options"] = "required"
      return ["", ""] 
    }
  }

  checkDuplicatedOptions(options, errors) {
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
}
