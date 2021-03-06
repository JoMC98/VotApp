import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';
import { LoginControllerService } from 'src/app/services/authentication/login-controller.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  dni: string;
  profile: boolean;
  
  private sub: any;
  private subQ: any;

  showPasswdState: boolean;
 
  usuario = {DNI: "", nombre: "", apellidos: "", mail: "", telefono: "", cargo: "", departamento: "", f_registro: "", clavePublica: ""};
  listaDepartamentos = {};

  constructor(private route: ActivatedRoute, private router: Router, private controllerBD: DatabaseControllerService, 
    private listDepartamentos: ListaDepartamentosService, private loginController: LoginControllerService, private sessionController: SessionControllerService) { 
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.dni = params['dni']; 
      this.checkAdmin()
      this.listaDepartamentos = this.listDepartamentos.getDepartamentos();
      this.controllerBD.obtenerUsuario(this.dni).then((result) =>{
        this.usuario = result[0];
      });
    });
    this.subQ = this.route.queryParams.subscribe(params => {
      this.profile = JSON.parse(params['profile']); 
    });
  }

  checkAdmin() {
    var admin = this.sessionController.getAdminSession();
    if (admin) {
      var myDNI = this.sessionController.getDNISession();
      if (this.dni == myDNI) {
        this.showPasswdState = false;
      } else {
        this.showPasswdState = true;
      }
    } else {
      this.showPasswdState = false;
    }
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    // this.subQ.unsubscribe();
  }

  logout() {
    this.loginController.logout();
  }

  modify() {
    new Promise((res) => {
      setTimeout(() => {
        this.controllerBD.addTemporalUser(this.usuario);
        this.router.navigate(['/modifyUser',this.dni], { queryParams: {profile: this.profile} });
        res();
      }, 100);
    })
  }

}
