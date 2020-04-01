import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';

@Component({
  selector: 'app-resumen-user',
  templateUrl: './resumen-user.component.html',
  styleUrls: ['./resumen-user.component.css']
})
export class ResumenUserComponent implements OnInit {

  @Input() data;

  constructor(private router: Router, private controllerBD: DatabaseControllerService) { 
  }

  ngOnInit(): void {
  }

  confirmUser() {
    var usuario = {}
    for (var k of Object.keys(this.data.personalData)) {
      usuario[k] = this.data.personalData[k]
    }
    for (var k of Object.keys(this.data.contactData)) {
      usuario[k] = this.data.contactData[k]
    }
    this.controllerBD.añadirUsuario(usuario).then((result) =>{
      new Promise((res) => {
        setTimeout(() => {
          this.router.navigate(['/users']);
          res();
        }, 1000);
      })
    });
  }

  cancelUser() {
    new Promise((res) => {
      setTimeout(() => {
        this.router.navigate(['/users']);
        res();
      }, 1500);
    })
  }

}
