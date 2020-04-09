import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseControllerService } from 'src/app/services/database/database-controller.service';
import { ListaDepartamentosService } from 'src/app/services/general/lista-departamentos.service';
import { LoginControllerService } from 'src/app/services/authentication/login-controller.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
 
  usuario = {DNI: "", nombre: "", apellidos: "", mail: "", telefono: "", cargo: "", departamento: "", f_registro: ""};
  listaDepartamentos = {};

  constructor(private route: ActivatedRoute, private router: Router, private controllerBD: DatabaseControllerService, private listDepartamentos: ListaDepartamentosService, private loginController: LoginControllerService) { 
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.dni = params['dni']; 
      this.listaDepartamentos = this.listDepartamentos.getDepartamentos();
      this.controllerBD.obtenerUsuario(this.dni).then((result) =>{
        this.usuario = result[0];
      });
    });
    this.subQ = this.route.queryParams.subscribe(params => {
      this.profile = JSON.parse(params['profile']); 
    });
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
