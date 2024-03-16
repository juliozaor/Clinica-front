import { Component } from '@angular/core';
import { LogArchivos } from '../../compartido/modelos/LogArchivos';
import { Paginador } from '../../compartido/modelos/Paginador';
import { FiltrosLogs } from '../../compartido/modelos/FiltrosLogs';
import { LogsService } from '../../services/logs.service';
import { Observable } from 'rxjs';
import { Paginacion } from '../../compartido/modelos/Paginacion';

@Component({
  selector: 'app-log-archivos',
  templateUrl: './log-archivos.component.html',
  styleUrl: './log-archivos.component.css'
})
export class LogArchivosComponent {


  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5
  paginadorReportes: Paginador<FiltrosLogs>
  logArchivos: LogArchivos[] = []

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
      this.servicioLogs.consultar(pagina, limite, filtros, '6' ).subscribe({
        next: ( respuesta:any )=>{          
          this.logArchivos = respuesta.logs
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
