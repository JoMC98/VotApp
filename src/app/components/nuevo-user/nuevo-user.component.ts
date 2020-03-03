import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo-user',
  templateUrl: './nuevo-user.component.html',
  styleUrls: ['./nuevo-user.component.css']
})
export class NuevoUserComponent implements OnInit {
  sect: number = 1;
  points: number[] = [1,2,3];

  constructor() { }

  ngOnInit(): void {
  }

  cambioPag(ind) {
    if (ind == 1) {
      this.sect = ((this.sect - 1) == 0 ? 1 : this.sect - 1);
    } else {
      this.sect = ((this.sect + 1) == 4 ? 3 : this.sect + 1);
    }
  }

}
