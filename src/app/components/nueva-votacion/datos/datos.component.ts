import { Component, OnInit, Input } from '@angular/core';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css'],
})
export class DatosComponent implements OnInit {

  departamentos = [];
  selected: string = "none";
  ambitoDescripcion = {"none": "", "Publica": "La votación será visible para todos", 
                       "Departamento": "La votación será visible por miembros del departamento", 
                       "Privada": "La votación solo será visible para los participantes", 
                       "Oculta": "La votación no será visible para nadie"};

  @Input() data;

  constructor(private listDepartamentos: ListaDepartamentosService) {
    this.departamentos = this.listDepartamentos.getDepartamentosOnlyName();
  }

  ngOnInit(): void {
  }
}
