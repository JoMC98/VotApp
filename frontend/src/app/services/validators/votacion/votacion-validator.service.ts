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
}
