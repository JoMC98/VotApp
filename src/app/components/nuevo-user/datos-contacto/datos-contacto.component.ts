import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-datos-contacto',
  templateUrl: './datos-contacto.component.html',
  styleUrls: ['./datos-contacto.component.css']
})
export class DatosContactoComponent implements OnInit {

  @Input() data;

  constructor() { }

  ngOnInit(): void {
  }

}
