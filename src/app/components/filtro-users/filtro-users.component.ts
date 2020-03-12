import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

export interface FilterData {
  nombre;
  cargo;
  departamentos;
}

@Component({
  selector: 'app-filtro-users',
  templateUrl: './filtro-users.component.html',
  styleUrls: ['./filtro-users.component.css']
})
export class FiltroUsersComponent implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<FiltroUsersComponent>, 
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: FilterData) {}


  ngOnInit(): void {
  }

  filtrar() {
    this._bottomSheetRef.dismiss();
  }

}
