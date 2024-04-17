import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalizarComponent } from './analizar/analizar.component';
import { GestionarComponent } from './gestionar/gestionar.component';
import { ValidarComponent } from './validar/validar.component';
import { InformesComponent } from './informes/informes.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { BusquedaIndividualComponent } from './busqueda-individual/busqueda-individual.component';
import { BusquedaAgrupadoComponent } from './busqueda-agrupado/busqueda-agrupado.component';

const routes: Routes = [
  { path:'analizar/:parametro', component:AnalizarComponent},
  { path:'gestionar', component:GestionarComponent},
  { path:'validar', component:ValidarComponent},
  { path:'informes', component:InformesComponent},
  { path:'busqueda', component:BusquedaComponent},
  { path:'busquedaIndividual/:formulario', component:BusquedaIndividualComponent},
  { path:'busquedaGrupal/:formulario', component:BusquedaAgrupadoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormulariosRoutingModule { }
