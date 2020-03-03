import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ListadoVotacionesComponent } from './components/listado-votaciones/listado-votaciones.component';
import { NuevaVotacionComponent } from './components/nueva-votacion/nueva-votacion.component';
import { UsersComponent } from './components/users/users.component';
import { NuevoUserComponent } from './components/nuevo-user/nuevo-user.component';
import { PasswdComponent } from './components/passwd/passwd.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatosComponent } from './components/nueva-votacion/datos/datos.component';
import { OpcionesComponent } from './components/nueva-votacion/opciones/opciones.component';
import { ParticipantesComponent } from './components/nueva-votacion/participantes/participantes.component';
import { ResumenComponent } from './components/nueva-votacion/resumen/resumen.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DatosPersonalesComponent } from './components/nuevo-user/datos-personales/datos-personales.component';
import { DatosContactoComponent } from './components/nuevo-user/datos-contacto/datos-contacto.component';
import { ResumenUserComponent } from './components/nuevo-user/resumen-user/resumen-user.component';

registerLocaleData(localeEs, 'es')

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ListadoVotacionesComponent,
    NuevaVotacionComponent,
    UsersComponent,
    NuevoUserComponent,
    PasswdComponent,
    PageNotFoundComponent,
    DatosComponent,
    OpcionesComponent,
    ParticipantesComponent,
    ResumenComponent,
    DatosPersonalesComponent,
    DatosContactoComponent,
    ResumenUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    AngularSvgIconModule.forRoot(),
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRippleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgSelectModule, 
    FormsModule
  ],
  entryComponents: [FooterComponent, ListadoVotacionesComponent, NuevaVotacionComponent],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, MatNativeDateModule ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
