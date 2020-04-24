import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoVotacionesComponent } from '../app/components/listado-votaciones/listado-votaciones.component';
import { NuevaVotacionComponent } from '../app/components/nueva-votacion/nueva-votacion.component';
import { UsersComponent } from '../app/components/users/users.component';
import { NuevoUserComponent } from '../app/components//nuevo-user/nuevo-user.component';
import { HomeComponent } from '../app/components/home/home.component';
import { VotacionComponent } from './components/votacion/votacion.component';
import { UserComponent } from './components/user/user.component';
import { ModifyUserComponent } from './components/modify-user/modify-user.component';
import { VotarComponent } from './components/votacion/votar/votar.component';
import { ResultadosComponent } from './components/votacion/resultados/resultados.component';
import { StartComponent } from './components/votacion/start/start.component';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordFirstComponent } from './components/user/change-password-first/change-password-first.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { RestrictedAccessComponent } from './components/errors/restricted-access/restricted-access.component';


const routes: Routes = [
  { path: 'listadoVotaciones', component: ListadoVotacionesComponent },
  { path: 'nuevaVotacion', component: NuevaVotacionComponent },
  { path: 'users', component: UsersComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'changePasswd', component: ChangePasswordFirstComponent },
  { path: 'nuevoUser', component: NuevoUserComponent },
  { path: 'votacion/:codigo', component: VotacionComponent },
  { path: 'votar/:codigo', component: VotarComponent },
  { path: 'resultados/:codigo', component: ResultadosComponent },
  { path: 'iniciarVotacion/:codigo', component: StartComponent },
  { path: 'user/:dni', component: UserComponent },
  { path: 'modifyUser/:dni', component: ModifyUserComponent },
  { path: 'restrictedAccess', component: RestrictedAccessComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
