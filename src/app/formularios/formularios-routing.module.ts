import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalizarComponent } from './analizar/analizar.component';
import { GestionarComponent } from './gestionar/gestionar.component';
import { ValidarComponent } from './validar/validar.component';
import { InformesComponent } from './informes/informes.component';

const routes: Routes = [
  { path:'analizar/:parametro', component:AnalizarComponent},
  { path:'gestionar', component:GestionarComponent},
  { path:'validar', component:ValidarComponent},
  { path:'informes', component:InformesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormulariosRoutingModule { }
