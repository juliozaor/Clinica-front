import { Component } from '@angular/core';
import { LogLogin } from '../../compartido/modelos/LogLogin';
import { LogsService } from '../../services/logs.service';
import { FiltrosLogs } from '../../compartido/modelos/FiltrosLogs';
import { Paginador } from '../../compartido/modelos/Paginador';
import { Observable } from 'rxjs';
import { Paginacion } from '../../compartido/modelos/Paginacion';

@Component({
  selector: 'app-log-login',
  templateUrl: './log-login.component.html',
  styleUrl: './log-login.component.css'
})
export class LogLoginComponent {
  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5
  paginadorReportes: Paginador<FiltrosLogs>
  logLogin: LogLogin[] = []

  termino: string = ""

  constructor(
    private servicioLogs: LogsService
  ){ 
   
    this.paginadorReportes = new Paginador<FiltrosLogs>(this.obtenerLogs)    
  }

  ngOnInit(): void {
    this.paginadorReportes.inicializar(this.paginaInicial, this.limiteInicial, {})
  }
  obtenerLogs = (pagina: number, limite: number, filtros?:FiltrosLogs)=>{
    return new Observable<Paginacion>( sub => {
      this.servicioLogs.consultar(pagina, limite, filtros, '1' ).subscribe({
        next: ( respuesta:any )=>{          
          this.logLogin = respuesta.logs
          sub.next(respuesta.paginacion)
        }
      })
    })
  }

  actualizarFiltros(){
    this.paginadorReportes.filtrar({ termino: this.termino })
  }

  limpiarFiltros(){
    this.termino = ""
    this.paginadorReportes.filtrar({ termino: this.termino })
  }

  setTermino(termino: string){
    this.termino = termino
  }

}
