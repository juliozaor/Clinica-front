import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth/auth.component';
import { PagesComponent } from './pages/pages.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  {
    path: 'dashboard',
    component: PagesComponent,
    children: [
      {
        path: 'formulario',
        loadChildren: () =>
          import('./formularios/formularios.module').then(
            (m) => m.FormulariosModule
          ),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./usuarios/usuarios.module').then(
            (m) => m.UsuariosModule
            ),
      },
      {
        path: 'archivos',
        loadChildren: () =>
          import('./archivos/archivos.module').then(
            (m) => m.ArchivosModule
            ),
      },
      { path: 'home', component: HomeComponent },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ],
    canActivate: [authGuard], // proteccion de rutas
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
