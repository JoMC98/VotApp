import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { BrowserModule} from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { ListadoVotacionesComponent } from './components/listado-votaciones/listado-votaciones.component';
import { NuevaVotacionComponent } from './components/nueva-votacion/nueva-votacion.component';
import { UsersComponent } from './components/users/users.component';
import { NuevoUserComponent } from './components/nuevo-user/nuevo-user.component';
import { DatosComponent } from './components/nueva-votacion/datos/datos.component';
import { OpcionesComponent } from './components/nueva-votacion/opciones/opciones.component';
import { ParticipantesComponent } from './components/nueva-votacion/participantes/participantes.component';
import { ResumenComponent } from './components/nueva-votacion/resumen/resumen.component';
import { DatosPersonalesComponent } from './components/nuevo-user/datos-personales/datos-personales.component';
import { DatosContactoComponent } from './components/nuevo-user/datos-contacto/datos-contacto.component';
import { ResumenUserComponent } from './components/nuevo-user/resumen-user/resumen-user.component';
import { FiltroVotacionesComponent } from './components/listado-votaciones/filtro-votaciones/filtro-votaciones.component';
import { FiltroUsersComponent } from './components/filtro-users/filtro-users.component';
import { VotacionComponent } from './components/votacion/votacion.component';
import { UserComponent } from './components/user/user.component';
import { ModifyUserComponent } from './components/modify-user/modify-user.component';
import { DesplegableVotacionComponent } from './components/votacion/desplegable-votacion/desplegable-votacion.component';
import { VotarComponent } from './components/votacion/votar/votar.component';
import { ResultadosComponent } from './components/votacion/resultados/resultados.component';
import { StartComponent } from './components/votacion/start/start.component';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordFirstComponent } from './components/user/change-password-first/change-password-first.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { RestrictedAccessComponent } from './components/errors/restricted-access/restricted-access.component';
import { WaitComponent } from './components/votacion/wait/wait.component';
import { AlteracionComponent } from './components/votacion/alteracion/alteracion.component';
import { ErrorComponent } from './components/votacion/error/error.component';
import { ServerErrorComponent } from './components/errors/server-error/server-error.component';
import { ConnectionErrorComponent } from './components/errors/connection-error/connection-error.component';
import { StopComponent } from './components/votacion/stop/stop.component';

registerLocaleData(localeEs, 'es')

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    ListadoVotacionesComponent,
    NuevaVotacionComponent,
    UsersComponent,
    NuevoUserComponent,
    DatosComponent,
    OpcionesComponent,
    ParticipantesComponent,
    ResumenComponent,
    DatosPersonalesComponent,
    DatosContactoComponent,
    ResumenUserComponent,
    FiltroVotacionesComponent,
    FiltroUsersComponent,
    VotacionComponent,
    UserComponent,
    ModifyUserComponent,
    DesplegableVotacionComponent,
    VotarComponent,
    ResultadosComponent,
    StartComponent,
    LoginComponent,
    ChangePasswordFirstComponent,
    NotFoundComponent,
    RestrictedAccessComponent,
    WaitComponent,
    AlteracionComponent,
    ErrorComponent,
    ServerErrorComponent,
    ConnectionErrorComponent,
    StopComponent
  ],
  imports: [
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRippleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatBottomSheetModule,
    MatCardModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    AngularSvgIconModule.forRoot(),
    NgSelectModule, 
    HttpClientModule,
    NgbModule,
    FormsModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [FooterComponent, ListadoVotacionesComponent, NuevaVotacionComponent],
  providers: [ 
    { provide: LOCALE_ID, useValue: 'es' }, 
    MatNativeDateModule, 
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
