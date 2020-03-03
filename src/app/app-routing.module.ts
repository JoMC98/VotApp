import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoVotacionesComponent } from '../app/components/listado-votaciones/listado-votaciones.component';
import { NuevaVotacionComponent } from '../app/components/nueva-votacion/nueva-votacion.component';
import { UsersComponent } from '../app/components/users/users.component';
import { PasswdComponent } from '../app/components/passwd/passwd.component';
import { NuevoUserComponent } from '../app/components//nuevo-user/nuevo-user.component';
import { HomeComponent } from '../app/components/home/home.component';
import { PageNotFoundComponent } from '../app/components/page-not-found/page-not-found.component';


const routes: Routes = [
  { path: 'listadoVotaciones', component: ListadoVotacionesComponent },
  { path: 'nuevaVotacion', component: NuevaVotacionComponent },
  { path: 'users', component: UsersComponent },
  { path: 'home', component: HomeComponent },
  { path: 'passwd', component: PasswdComponent },
  { path: 'nuevoUser', component: NuevoUserComponent },
  { path: '', redirectTo: '/listadoVotaciones', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
