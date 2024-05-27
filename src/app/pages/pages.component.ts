import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ModuloModel } from '../models/modulo.model';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css',
})
export class PagesComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  modulos: ModuloModel[] = [];
  mAdministrador: ModuloModel[] = [];
  mFormularios: ModuloModel[] = [];
  mPdf?: ModuloModel;
  ifAdmin = true
  ifForm = true

  mostrarA: boolean = false;
  mostrarF: boolean = false;

  faTrash = faTrash;

  constructor(
    private observer: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private auth: AuthService,
    private router: Router
  ) {
    this.modulos = this.auth.obtenerModulos();
    this.distribuirModulos()
    if(this.mAdministrador.length <= 0){
      //this.ifForm = false
      this.ifAdmin = false
    }
    if(this.mFormularios.length <= 0){
      this.ifForm = false
      //this.ifAdmin = false
    }
    
  }

  ngAfterViewInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((resp: any) => {
      if (resp.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
    this.cd.detectChanges();
  }

  // ocultar panel lateral
  

  toggleBotones(b:number) {
    if(b ==1){
    this.mostrarA = !this.mostrarA
  }
  if(b==2){
    this.mostrarF = !this.mostrarF
  }
  }

  distribuirModulos(){
    this.modulos.forEach(modulo => {
      if(modulo.parent == 0){
        this.mAdministrador.push(modulo);
      }
      if(modulo.parent == 1){
        this.mFormularios.push(modulo);
      }
      if(modulo.parent == 2){
        this.mPdf = modulo;
      }
    });
  }

  salir() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
