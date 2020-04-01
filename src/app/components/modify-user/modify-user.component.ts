import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit, OnDestroy {
  dni: string;
  private sub: any;
  private subQ: any;

  departamentos = ["Administración","Dirección","Marketing","Finanzas"];
  usuario = {DNI: "", nombre: "", apellidos: "", mail: "", telefono: "", cargo: "", departamento: "", f_registro: ""};
  copyUsuario = {};

  actual: string = "";
  nueva: string = "";
  repetir: string = "";

  profile: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private controllerBD: DatabaseControllerService) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.dni = params['dni']; 
      this.usuario = this.controllerBD.getTemporalUser();
      this.makeCopy();
      if (this.usuario.DNI == "" || this.usuario.DNI != this.dni) {
        this.controllerBD.obtenerUsuario(this.dni).then((result) =>{
          this.usuario = result[0];
          this.makeCopy();
        });
      }
    });
    this.subQ = this.route.queryParams.subscribe(params => {
      this.profile = JSON.parse(params['profile']); 
    });
  }

  makeCopy() {
    this.copyUsuario = {}
    for (var k of Object.keys(this.usuario)) {
      this.copyUsuario[k] = this.usuario[k];
    }
  }

  comprobarCopy() {
    for (var k of Object.keys(this.usuario)) {
      if (this.copyUsuario[k] != this.usuario[k]) {
        return false;
      }
    }
    return true;
  }

  comprobarPassword() {
    if (this.actual != "" && this.nueva != "" && this.repetir != "") {
      if (this.nueva == this.repetir && this.nueva != this.actual) {
        return true;
      }
    }
    return false;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subQ.unsubscribe();
  }

  confirmarModify() {
    var routered = false;

    if (!this.comprobarCopy() && this.comprobarPassword()) {

      this.controllerBD.modificarUsuario(this.usuario).then((result) =>{ 

        var passwords = {DNI: this.dni, actual: this.actual, nueva: this.nueva};
        this.controllerBD.modificarContraseña(passwords).then((result) =>{
          this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });
        });

      });
    
    } else if (!this.comprobarCopy()) {

      this.controllerBD.modificarUsuario(this.usuario).then((result) =>{
        this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });
      });

    } else if (this.comprobarPassword()) {

      var passwords = {DNI: this.dni, actual: this.actual, nueva: this.nueva};
      this.controllerBD.modificarContraseña(passwords).then((result) =>{
        this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });
      });

    } else {

      this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });

    }
  }

}
