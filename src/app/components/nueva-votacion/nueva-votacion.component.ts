import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { fromEvent } from "rxjs";
import {takeWhile} from "rxjs/operators"


@Component({
  selector: 'app-nueva-votacion',
  templateUrl: './nueva-votacion.component.html',
  styleUrls: ['./nueva-votacion.component.css']
})
export class NuevaVotacionComponent implements OnInit, OnDestroy {
  sect = [];
  points: number[] = [1,2,3,4];

  alive:boolean=true;
  result:string;

  constructor() {
    this.sect = [1];
  }

  ngOnInit(): void {
    var myElement = document.getElementById('allBodyNuevaVotacion');
    var mc = new Hammer(myElement);
    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    var a = this.sect;
    
    mc.on("swipe", function(evt) {
      const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';
      if (x == "left") {
        a[0] = ((a[0] + 1) == 5 ? 4 : a[0] + 1);
      } else {
        a[0] = ((a[0] - 1) == 0 ? 1 : a[0] - 1);
      }
    });
  }

  ngOnDestroy() {}

  cambioPag(ind) {
    if (ind == 1) {
      this.sect[0] = ((this.sect[0] - 1) == 0 ? 1 : this.sect[0] - 1);
    } else {
      this.sect[0] = ((this.sect[0] + 1) == 5 ? 4 : this.sect[0] + 1);
    }
  }

}
