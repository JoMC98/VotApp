import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoVotacionesComponent } from '../app/components/listado-votaciones/listado-votaciones.component';
import { NuevaVotacionComponent } from '../app/components/nueva-votacion/nueva-votacion.component';
import { UsersComponent } from '../app/components/users/users.component';
import { PasswdComponent } from '../app/components/passwd/passwd.component';
import { NuevoUserComponent } from '../app/components//nuevo-user/nuevo-user.component';
import { HomeComponent } from '../app/components/home/home.component';
import { PageNotFoundComponent } from '../app/components/page-not-found/page-not-found.component';
import { VotacionComponent } from './components/votacion/votacion.component';
import { UserComponent } from './components/user/user.component';
import { ModifyUserComponent } from './components/modify-user/modify-user.component';
import { VotarComponent } from './components/votacion/votar/votar.component';
import { ResultadosComponent } from './components/votacion/resultados/resultados.component';
import { StartComponent } from './components/votacion/start/start.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
  { path: 'listadoVotaciones', component: ListadoVotacionesComponent },
  { path: 'nuevaVotacion', component: NuevaVotacionComponent },
  { path: 'users', component: UsersComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'passwd', component: PasswdComponent },
  { path: 'nuevoUser', component: NuevoUserComponent },
  { path: 'votacion/:id', component: VotacionComponent },
  { path: 'votar/:id', component: VotarComponent },
  { path: 'resultados/:id', component: ResultadosComponent },
  { path: 'iniciarVotacion/:id', component: StartComponent },
  { path: 'user/:dni', component: UserComponent },
  { path: 'modifyUser/:dni', component: ModifyUserComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
