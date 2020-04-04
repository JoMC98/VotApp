import { Component, OnInit, Input } from '@angular/core';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';

@Component({
  selector: 'app-datos-contacto',
  templateUrl: './datos-contacto.component.html',
  styleUrls: ['./datos-contacto.component.css']
})
export class DatosContactoComponent implements OnInit {

  @Input() data;
  departamentos = [];

  constructor(private listDepartamentos: ListaDepartamentosService) {
    this.departamentos = this.listDepartamentos.getDepartamentosOnlyName();
  }

  ngOnInit(): void {
  }

}
