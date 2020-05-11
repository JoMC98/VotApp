import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';
import { KeyPasswordControllerService } from 'src/app/services/cipher/key-password-controller.service';
import { UserValidatorService } from 'src/app/services/validators/user/user-validator.service';
import { CheckboxControlValueAccessor } from '@angular/forms';

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
                cargo: {required: "Este campo es obligatorio"}, 
                passwd: {required: "Los 3 campos son obligatorios", notChanged: "La contraseña nueva debe ser diferente de la actual", notSame: "Las contraseñas no coinciden",
                badFormed: "La nueva contraseña debe contener letras y números", length: "La nueva contraseña debe contener al menos 8 carácteres", incorrect: "Contraseña incorrecta"}}


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
    for (var k of Object.keys(this.copyUsuario)) {
      if (this.copyUsuario[k] != this.usuario[k]) {
        return true;
      }
    }
    return false;
  }

  comprobarPassword() {
    if (this.actual == "" && this.nueva == "" && this.repetir == "") {
      return false
    }
    return true;
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

  checkUser() {
    var changeUser = this.comprobarCopy()
    if (changeUser) {
      var errors = this.validator.checkUser(this.usuario)
      if (errors == true) {
        this.usuario.nombre = this.capitalizeFirstLetter(this.usuario.nombre)
        this.usuario.apellidos = this.capitalizeFirstLetter(this.usuario.apellidos)
        this.usuario.cargo = this.capitalizeFirstLetter(this.usuario.cargo)
        this.usuario["data"] = true
        return true;
      } else {
        for (var k of Object.keys(errors)) {
          this.errors[k] = errors[k]
        }
        return false;
      }
    } else {
      this.usuario["data"] = null
      return null;
    }
  }

  async checkPasswd() {
    return await new Promise((resolve, reject) => {
      var changePasswd = this.comprobarPassword()
      if (changePasswd) {
        var errors = this.validator.checkNewPassword(this.actual, this.nueva, this.repetir)
        if (errors == true) {
          this.kewPasswordController.generateAndEncryptKeyPair(this.nueva).then(claves => {
            this.usuario["passwords"] = {actual: this.actual, nueva: this.nueva, clavePublica: claves["clavePublica"], clavePrivada: claves["clavePrivada"]}
           resolve(true)
          });
        } else {
          this.errors["passwd"] = errors["passwd"]
          resolve(false)
        }
      } else {
        this.usuario["passwords"] = null
        resolve(null)
      }
    })
  }

  confirmarModify() {
    this.errors = {}
    var hasErrors = false;
    var hasData = false

    this.checkPasswd().then(res => {
      if (res != null) {
        if (res == true) {
          hasData = true;
        } else {
          hasErrors = true;
        }
      }

      var res2 = this.checkUser()
      if (res2 != null) {
        if (res2 == true) {
          hasData = true;
        } else {
          hasErrors = true;
        }
      }

      if (!hasData && !hasErrors) {
        this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });
      } else if (hasData && !hasErrors) {
        console.log("ENVIA PETICION")
        console.log(this.usuario)
        this.controllerBD.modificarUsuario(this.usuario)
          .then((result) =>{ 
            this.router.navigate(['/user',this.dni], { queryParams: {profile: this.profile} });
          }).catch(err => {
            console.log(err)
            if (err.code == 409) {
              if (err.mail != null) {
                this.errors["mail"] = "duplicated"
              }
              if (err.passwd != null) {
                this.errors["passwd"] = "incorrect"
              }
            }
          });
      }
    })
  }

  removeError(att) {
    delete this.errors[att];
  }
}
