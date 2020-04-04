import { Injectable } from '@angular/core';
import departamentos from '../../files/departamentos.json';

@Injectable({
  providedIn: 'root'
})
export class ListaDepartamentosService {

  constructor() { }

  getDepartamentos() {
    return departamentos;
  }

  getDepartamentosOnlyName() {
    return Object.keys(departamentos);
  }

  getDepartamentosJSONFalse() {
    var res = {}
    for (var k of Object.keys(departamentos)) {
      res[k] = false;
    }
    return res;
  }
}
