import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-descripcion',
  templateUrl: './descripcion.component.html',
  styleUrls: ['./descripcion.component.css']
})
export class DescripcionComponent implements OnInit {

  @Input() data;

  constructor() { }

  ngOnInit(): void {
  }

}
