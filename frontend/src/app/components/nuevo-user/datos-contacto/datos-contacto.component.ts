import { Component, OnInit, Input } from '@angular/core';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';

@Component({
  selector: 'app-datos-contacto',
  templateUrl: './datos-contacto.component.html',
  styleUrls: ['./datos-contacto.component.css']
})
export class DatosContactoComponent implements OnInit {

  @Input() data;
  @Input() errors;
  departamentos = [];

  errorTypes = {telefono: {required: "Este campo es obligatorio", length: "Este campo debe tener entre 7 y 11 carácteres"}, 
                mail: {required: "Este campo es obligatorio", badFormed: "Este campo debe seguir el formato de un correo (aa@bb.cc)", duplicated: "Este mail ya está en uso"},
                departamento: {required: "Este campo es obligatorio"}, cargo: {required: "Este campo es obligatorio"}}

  constructor(private listDepartamentos: ListaDepartamentosService) {
    this.departamentos = this.listDepartamentos.getDepartamentosOnlyName();
  }

  ngOnInit(): void {
  }

  removeError(att) {
    delete this.errors[att];
  }
}
