import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.css']
})
export class ParticipantesComponent implements OnInit {
  participantes = {"Administración" : {values: ["Paco Rodriguez Garcia", "Manolo Fuentes Lopez", "Lorenzo Fernandez Miralles"], selected : 0},
                   "Marketing" : {values: ["Paco Rodriguez Garcia", "Manolo Fuentes Lopez", "Lorenzo Fernandez Miralles", "Paco Rodriguez Garcia", "Manolo Fuentes Lopez"], selected : 0},
                   "Finanzas" : {values: ["Paco Rodriguez Garcia", "Manolo Fuentes Lopez", "Lorenzo Fernandez Miralles"], selected : 0},
                   "Dirección" : {values: ["Paco Rodriguez Garcia", "Manolo Fuentes Lopez", "Lorenzo Fernandez Miralles", "Paco Rodriguez Garcia", "Manolo Fuentes Lopez"], selected : 0},
                  }

  total: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  mostrarOcultar(key) {
    let valActual = document.getElementById('dpto' + key).style.display;
    let valNuevo = (valActual == 'none' ? 'block' : 'none');
    document.getElementById('dpto' + key).style.display = valNuevo;

    let icon = document.getElementById('flecha' + key).classList[2];;

    if (valNuevo == 'none' && icon == "fa-chevron-down") {
      document.getElementById('flecha' + key).classList.remove("fa-chevron-down");
      document.getElementById('flecha' + key).classList.add("fa-chevron-right");
    } else if (valNuevo == 'block' && icon == "fa-chevron-right") {
      document.getElementById('flecha' + key).classList.remove("fa-chevron-right");
      document.getElementById('flecha' + key).classList.add("fa-chevron-down");
    }
  }

  selection(checked, key, id) {
    if (checked) {
      this.participantes[key].selected += 1;
      this.total += 1;
      document.getElementById("checkbox-" + key + "-" + id).style.color = "#D1967D";
    } else {
      this.participantes[key].selected -= 1;
      this.total -= 1;
      document.getElementById("checkbox-" + key + "-" + id).style.color = "white";
    }
  }
}
