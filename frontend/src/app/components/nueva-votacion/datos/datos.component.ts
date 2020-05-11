import { Component, OnInit, Input } from '@angular/core';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { Moment } from 'moment';


class PickDateAdapter extends MomentDateAdapter {
  format(date: any): string {
    var d = formatDate(date, 'EEEE, d' + "' de '" + 'MMMM', this.locale)
    var words = d.split(" ")
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    words[3] = words[3].charAt(0).toUpperCase() + words[3].slice(1)
    
    d = words.join(' ')
    return d;
  }
}

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css'],
  providers: [
    {
      provide: DateAdapter, 
      useClass: PickDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class DatosComponent implements OnInit {

  departamentos = [];
  selected: string = "none";
  ambitoDescripcion = {"none": "", "Publica": "La votación será visible para todos", 
                       "Departamento": "La votación será visible por miembros del departamento", 
                       "Privada": "La votación solo será visible para los participantes", 
                       "Oculta": "La votación no será visible para nadie"};

  errorTypes = {pregunta: {required: "Este campo es obligatorio"}, 
                departamento: {required: "Este campo es obligatorio"},
                f_votacion: {required: "Este campo es obligatorio"}, 
                ambito: {required: "Este campo es obligatorio"}}

  minDate: Date;
  myFilter;

  @Input() data;
  @Input() errors;

  constructor(private listDepartamentos: ListaDepartamentosService, private adapter: DateAdapter<any>) {
    this.adapter.setLocale('es');
    this.departamentos = this.listDepartamentos.getDepartamentosOnlyName();
    this.minDate = new Date()
    this.myFilter = (d: any): boolean => {
      const day = d.weekday();
      return day !== 5 && day !== 6;
    }
  }

  ngOnInit(): void {
  }

  removeError(att) {
    delete this.errors[att];
  }
}
