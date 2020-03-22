import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo-user',
  templateUrl: './nuevo-user.component.html',
  styleUrls: ['./nuevo-user.component.css']
})
export class NuevoUserComponent implements OnInit {
  sect = [];
  points: number[] = [1,2,3];

  constructor() {
    this.sect = [1];
  }

  ngOnInit(): void {
    var myElement = document.getElementById('allBodyNuevoUser');
    var mc = new Hammer(myElement);
    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    var a = this.sect;
    
    mc.on("swipe", function(evt) {
      const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';
      if (x == "left") {
        a[0] = ((a[0] + 1) == 4 ? 3 : a[0] + 1);
      } else {
        a[0] = ((a[0] - 1) == 0 ? 1 : a[0] - 1);
      }
    });
  }

  cambioPag(ind) {
    if (ind == 1) {
      this.sect[0] = ((this.sect[0] - 1) == 0 ? 1 : this.sect[0] - 1);
    } else {
      this.sect[0] = ((this.sect[0] + 1) == 4 ? 3 : this.sect[0] + 1);
    }
  }

}
