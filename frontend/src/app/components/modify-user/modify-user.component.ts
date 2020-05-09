import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';
import { KeyPasswordControllerService } from 'src/app/services/cipher/key-password-controller.service';
import { UserValidatorService } from 'src/app/services/validators/user/user-validator.service';

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

  errors = {}

  errorTypes = {nombre: {required: "Este campo es obligatorio", badFormed: "Este campo no puede contener números"}, 
                apellidos: {required: "Este campo es obligatorio", badFormed: "Este campo no puede contener números"},
                telefono: {required: "Este campo es obligatorio", length: "Este campo debe tener entre 7 y 11 carácteres"}, 
                mail: {required: "Este campo es obligatorio", badFormed: "Este campo debe seguir el formato de un correo (aa@bb.cc)", duplicated: "Este mail ya está en uso"},
                cargo: {required: "Este campo es obligatorio"}}


  constructor(private route: ActivatedRoute, private router: Router, private controllerBD: DatabaseControllerService, 
    private listDepartamentos: ListaDepartamentosService,  private kewPasswordController: KeyPasswordControllerService, 
    private validator: UserValidatorService) { 
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
      } else {
        if (this.nueva == this.actual) {
          this.errors["password"] = "notChanged"
        } else if (this.nueva != this.repetir) {
          this.errors["password"] = "notSame"
        }
      }
    } else {
      this.errors["password"] = "required"
    }
    return false;
  }

  async changePassword() {
    return await new Promise((resolve, reject) => {
      if (this.comprobarPassword() == true) {
        this.validator.checkNewPassword(this.nueva).then(() => {
          this.kewPasswordController.generateAndEncryptKeyPair(this.nueva).then(claves => {
            var body = {DNI: this.dni, actual: this.actual, nueva: this.nueva, clavePublica: claves["clavePublica"], clavePrivada: claves["clavePrivada"]}
            console.log("MODIFICANDO ")
            console.log(body)
            resolve(true)
            // this.controllerBD.modificarContraseña(body)
            //   .then((result) =>{
            //     resolve(true)
            //   }).catch(err => {
            //     if (err.code == 406) {
            //       this.errors["password"] = "incorrect"
            //     }
            //     resolve(true)
            //   });
          });
        }).catch(errors => {
          console.log(errors)
          this.errors["passwd"] = errors["passwd"]
          resolve(true)
        })
        
      } else {
        resolve(false)
      }
    })
  }

  async changeUser() {
    return await new Promise((resolve, reject) => {
      if (this.comprobarCopy()) {
        this.validator.checkUser(this.usuario).then(() => {
          this.usuario.nombre = this.capitalizeFirstLetter(this.usuario.nombre)
          this.usuario.apellidos = this.capitalizeFirstLetter(this.usuario.apellidos)
          this.usuario.cargo = this.capitalizeFirstLetter(this.usuario.cargo)
          console.log("MODIFICANDO ")
          console.log(this.usuario)
          resolve(true)
          // this.controllerBD.modificarUsuario(this.usuario)
          //   .then((result) =>{ 
          //     resolve(true)
          //   }).catch(err => {
          //     if (err.code == 409) {
          //       if (err.mail != null) {
          //         this.errors["mail"] = "duplicated"
          //       }
          //     }
          //     resolve(true)
          //   });
        }).catch(errors => {
          this.errors = errors
          resolve(true)
        })
        
      } else {
        resolve(false)
      }
    })
  }

  capitalizeFirstLetter(str) {
    var words = str.split(" ")
    var wordsCap = []
    for (var w of words) {
      wordsCap.push(w.charAt(0).toUpperCase() + w.slice(1))
    }
    return wordsCap.join(' ')
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    // this.subQ.unsubscribe();
  }

  confirmarModify() {
    var routered = false;
    this.errors = {}
    this.changeUser().then(res => {
      this.changePassword().then(res => {
        if (Object.keys(this.errors).length == 0) {
          this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });
        } else {
          console.log(this.errors)
        }
        
      })
    })
  }

}
