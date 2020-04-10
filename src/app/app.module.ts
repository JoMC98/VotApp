import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { BrowserModule} from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ListadoVotacionesComponent } from './components/listado-votaciones/listado-votaciones.component';
import { NuevaVotacionComponent } from './components/nueva-votacion/nueva-votacion.component';
import { UsersComponent } from './components/users/users.component';
import { NuevoUserComponent } from './components/nuevo-user/nuevo-user.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { DatosComponent } from './components/nueva-votacion/datos/datos.component';
import { OpcionesComponent } from './components/nueva-votacion/opciones/opciones.component';
import { ParticipantesComponent } from './components/nueva-votacion/participantes/participantes.component';
import { ResumenComponent } from './components/nueva-votacion/resumen/resumen.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DatosPersonalesComponent } from './components/nuevo-user/datos-personales/datos-personales.component';
import { DatosContactoComponent } from './components/nuevo-user/datos-contacto/datos-contacto.component';
import { ResumenUserComponent } from './components/nuevo-user/resumen-user/resumen-user.component';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { OrderByPipe } from './order-by.pipe';
import { SortPipe } from './sort.pipe';

import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import {MatSidenavModule} from '@angular/material/sidenav';

import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { FiltroVotacionesComponent } from './components/listado-votaciones/filtro-votaciones/filtro-votaciones.component';
import { FiltroUsersComponent } from './components/filtro-users/filtro-users.component';
import { VotacionComponent } from './components/votacion/votacion.component';
import { UserComponent } from './components/user/user.component';
import { ModifyUserComponent } from './components/modify-user/modify-user.component';

import {MatCardModule} from '@angular/material/card';
import { DesplegableVotacionComponent } from './components/votacion/desplegable-votacion/desplegable-votacion.component';
import { VotarComponent } from './components/votacion/votar/votar.component';
import { ResultadosComponent } from './components/votacion/resultados/resultados.component';
import {MatProgressSpinnerModule, MatSpinner} from '@angular/material/progress-spinner';
import { StartComponent } from './components/votacion/start/start.component';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordFirstComponent } from './components/user/change-password-first/change-password-first.component';

import {HammerGestureConfig,HAMMER_GESTURE_CONFIG} from "@angular/platform-browser";

import * as Hammer from "hammerjs";
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { RestrictedAccessComponent } from './components/errors/restricted-access/restricted-access.component';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { 
      direction: Hammer.DIRECTION_ALL,
      velocity: 0.1,
      threshold: 5,
    }
  };
}

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
    OrderByPipe,
    SortPipe,
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
    RestrictedAccessComponent
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
    FormsModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [FooterComponent, ListadoVotacionesComponent, NuevaVotacionComponent],
  providers: [ 
    { provide: LOCALE_ID, useValue: 'es' }, 
    MatNativeDateModule, 
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig}
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
