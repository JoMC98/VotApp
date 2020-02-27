import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nueva-votacion',
  templateUrl: './nueva-votacion.component.html',
  styleUrls: ['./nueva-votacion.component.css']
})
export class NuevaVotacionComponent implements OnInit {
  sect: number = 1;
  points: number[] = [1,2,3,4];

  constructor() { }

  ngOnInit(): void {
  }

  cambioPag(ind) {
    if (ind == 1) {
      this.sect = ((this.sect - 1) == 0 ? 1 : this.sect - 1);
    } else {
      this.sect = ((this.sect + 1) == 5 ? 4 : this.sect + 1);
    }
  }

}
