import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalizarComponent } from './analizar/analizar.component';
import { GestionarComponent } from './gestionar/gestionar.component';
import { ValidarComponent } from './validar/validar.component';
import { FormulariosRoutingModule } from './formularios-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertasModule } from '../alertas/alertas.module';
import { InformesComponent } from './informes/informes.component';
import { InputBusquedaComponent } from './input-busqueda/input-busqueda.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogLoginComponent } from './log-login/log-login.component';
import { LogFormComponent } from './log-form/log-form.component';
import { LogRobotComponent } from './log-robot/log-robot.component';
import { LogOracleComponent } from './log-oracle/log-oracle.component';
import { LogEstadoFormularioComponent } from './log-estado-formulario/log-estado-formulario.component';
import { LogArchivosComponent } from './log-archivos/log-archivos.component';
import { MatIconModule } from '@angular/material/icon';
import { ModalDetallesComponent } from './modal-detalles/modal-detalles.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { BusquedaIndividualComponent } from './busqueda-individual/busqueda-individual.component';
import { BusquedaAgrupadoComponent } from './busqueda-agrupado/busqueda-agrupado.component';


@NgModule({
  declarations: [
    AnalizarComponent,
    GestionarComponent,
    ValidarComponent,
    InformesComponent,
    InputBusquedaComponent,
    LogLoginComponent,
    LogFormComponent,
    LogRobotComponent,
    LogOracleComponent,
    LogEstadoFormularioComponent,
    LogArchivosComponent,
    ModalDetallesComponent,
    BusquedaComponent,
    BusquedaIndividualComponent,
    BusquedaAgrupadoComponent
  ],
  imports: [
    CommonModule,
    FormulariosRoutingModule,
    FormsModule,
    FontAwesomeModule,
    AlertasModule,
    ReactiveFormsModule,
    NgbModule,
    MatIconModule
  ]
})
export class FormulariosModule { }
