import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NuevaVotacionComponent } from '../nueva-votacion.component';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {
  @Input() data;

  constructor(private router: Router, private controllerBD: DatabaseControllerService) { }

  ngOnInit(): void {
  }

  confirmVotacion() {
    console.log(this.data)
    // this.controllerBD.añadirVotacion(this.data).then((result) =>{
    //   new Promise((res) => {
    //     setTimeout(() => {
    //       this.router.navigate(['/listadoVotaciones']);
    //       res();
    //     }, 1000);
    //   })
    // }).catch(err => {
    //   //TODO ERRORES 
    //   console.log(err);
    // });
  }

  cancelVotacion() {
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
          this.router.navigate(['/nuevaVotacion']));
        res();
      }, 1500);
    })
  }

  redirectTo(uri:string){
    
 }
}
