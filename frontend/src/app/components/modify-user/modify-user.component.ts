import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';
import { KeyPasswordControllerService } from 'src/app/services/cipher/key-password-controller.service';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit, OnDestroy {
  dni: string;
  private sub: any;
  private subQ: any;

  departamentos = [];
  usuario = {DNI: "", nombre: "", apellidos: "", mail: "", telefono: "", cargo: "", departamento: "", f_registro: ""};
  copyUsuario = {};

  actual: string = "";
  nueva: string = "";
  repetir: string = "";

  profile: boolean;

  listaDepartamentos = {};

  constructor(private route: ActivatedRoute, private router: Router, private controllerBD: DatabaseControllerService, 
    private listDepartamentos: ListaDepartamentosService,  private kewPasswordController: KeyPasswordControllerService) { 
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.dni = params['dni']; 
      this.listaDepartamentos = this.listDepartamentos.getDepartamentos();
      this.departamentos = this.listDepartamentos.getDepartamentosOnlyName();
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
        return true;
      }
    }
    return false;
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
    // this.sub.unsubscribe();
    // this.subQ.unsubscribe();
  }

  confirmarModify() {
    var routered = false;

    if (this.comprobarPassword()) {
      this.kewPasswordController.generateAndEncryptKeyPair(this.nueva).then(claves => {
        var body = {DNI: this.dni, actual: this.actual, nueva: this.nueva, clavePublica: claves["clavePublica"], clavePrivada: claves["clavePrivada"]}
        this.controllerBD.modificarContraseña(body).then((result) =>{

          if (this.comprobarCopy()) {
            this.controllerBD.modificarUsuario(this.usuario).then((result) =>{ 
              this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });
            });
          } else {
            this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });
          }
        }).catch(err => {
          //TODO ERROR PASSWORD
          console.log(err);
          this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });
        });
      }).catch(err => {
        console.log(false)
        //ERROR
      })
    } else {
      if (this.comprobarCopy()) {
        this.controllerBD.modificarUsuario(this.usuario).then((result) =>{ 
          this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });
        }).catch(err => {
          //TODO DUPLICADOS
          console.log(err);
          this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });
        });
      } else {
        this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });
      }
    }
  }

}
