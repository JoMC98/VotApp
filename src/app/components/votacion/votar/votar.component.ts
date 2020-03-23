import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-votar',
  templateUrl: './votar.component.html',
  styleUrls: ['./votar.component.css']
})
export class VotarComponent implements OnInit, OnDestroy {
  id: number;
  private sub: any;

  pregunta: string = "¿Deberiamos abrir una nueva sucursal en Valencia?";
  
  opciones = [];
  opt = 0;

  optList = [["Sí, deberiamos abrirla", "No, que va, no te ralles", "Pero que cojones dices?", "Tal vez es buena idea", "Consultare con tu puta madre", "Ande esta er beti"],
             ["Sí, deberiamos abrirla", "No, que va, no te ralles", "Pero que cojones dices?", "Tal vez es buena idea", "Consultare con tu puta madre"],
             ["Sí, deberiamos abrirla", "No, que va, no te ralles", "Pero que cojones dices?", "Tal vez es buena idea"],
             ["Sí, deberiamos abrirla", "No, que va, no te ralles", "Pero que cojones dices?"],
             ["Sí, deberiamos abrirla", "No, que va, no te ralles"]];

  seleccion = null;
  selected = false;
  options = [];
  total: number = 0;
  row2: boolean = false;
  card: string = "";
  center = [];

  activarBoton: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) { 
    this.opciones = this.optList[this.opt];
    this.generateOptions();
  }

  generateOptions() {
    this.total = this.opciones.length;
    this.row2 = this.total < 3 ? true : false;
    this.options = [];

    if (this.total < 5) {
      this.card = "card2filas";
    } else if (this.total < 7) {
      this.card = "card3filas";
    } else {
      this.card = "card4filas";
    }

    var i = 0;
    for (var op of this.opciones) {
      var dict = {};
      dict["pregunta"] = op;
      dict["color"] = "cardColorOpcion" + i;
      dict["card"] = this.card;
      dict["cardZona"] = "";
      dict["selected"] = "";

      if (this.total == 2) {
        dict["card"] = this.card + "CenterVertical";
      }
      else if (this.total == 3 && (i == 2)) {
        dict["card"] = this.card + "Center";
      } else if (this.total == 5 && (i == 2)) {
        dict["card"] = this.card + "Center";
      } 

      if ((this.total == 3 || this.total == 4) && (i < 2)) {
        dict["cardZona"] = "card2filasArriba";
      } else if ((this.total == 3 || this.total == 4) && (i > 1)) {
        dict["cardZona"] = "card2filasAbajo";
      }

      this.options.push(dict);
      i++;
    }
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; 
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  cambiarOpciones() {
    this.opt += 1;
    if (this.opt == this.optList.length) {
      this.opt = 0;
    }
    this.opciones = this.optList[this.opt];
    this.generateOptions();
  }

  select(id) {
    for (var i in this.options) {
      this.options[i]["selected"] = "";
    }
    if (this.selected && id == this.seleccion) {
      this.selected = false;
      this.seleccion = null;
    } else {
      this.selected = true;
      this.seleccion = id;
      this.options[id]["selected"] = "cardFilasSelected";
    }
  }

  rutar() {
    this.activarBoton = true
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigate(['/resultados', this.id]);
        res();
      }, 3000);
    })
  }
}
