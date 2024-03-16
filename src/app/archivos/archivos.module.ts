import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturasComponent } from './facturas/facturas.component';
import { RegistrosComponent } from './registros/registros.component';
import { ArchivosRoutingModule } from './archivos-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputBusquedaComponent } from './input-busqueda/input-busqueda.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ModalVerArchivoComponent } from './modal-ver-archivo/modal-ver-archivo.component';
import { ModalActualizarArchivoComponent } from './modal-actualizar-archivo/modal-actualizar-archivo.component';
import { ModalGuardarArchivoComponent } from './modal-guardar-archivo/modal-guardar-archivo.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertasModule } from '../alertas/alertas.module';



@NgModule({
  declarations: [
    ModalVerArchivoComponent,
    FacturasComponent,
    RegistrosComponent,
    InputBusquedaComponent,
    ModalActualizarArchivoComponent,
    ModalGuardarArchivoComponent,
  ],
  imports: [
    CommonModule,
    ArchivosRoutingModule,
    NgbModule,
    FormsModule, 
    ReactiveFormsModule,
    MatIconModule,
    NgSelectModule,
    AlertasModule,
  ]
})
export class ArchivosModule { }
