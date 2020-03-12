import { FilterData } from './../listado-votaciones.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-filtro-votaciones',
  templateUrl: './filtro-votaciones.component.html',
  styleUrls: ['./filtro-votaciones.component.css']
})
export class FiltroVotacionesComponent implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<FiltroVotacionesComponent>, 
                  @Inject(MAT_BOTTOM_SHEET_DATA) public data: FilterData) {}


  ngOnInit(): void {
  }

  filtrar() {
    this._bottomSheetRef.dismiss();
  }
}
