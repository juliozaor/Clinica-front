import { Component } from '@angular/core';
import { LogOracle } from '../../compartido/modelos/LogOracle';
import { Observable } from 'rxjs';
import { Paginacion } from '../../compartido/modelos/Paginacion';
import { FiltrosLogs } from '../../compartido/modelos/FiltrosLogs';
import { Paginador } from '../../compartido/modelos/Paginador';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-log-oracle',
  templateUrl: './log-oracle.component.html',
  styleUrl: './log-oracle.component.css'
})
export class LogOracleComponent {

  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5
  paginadorReportes: Paginador<FiltrosLogs>
  logOracle: LogOracle[] = []

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
      this.servicioLogs.consultar(pagina, limite, filtros, '4' ).subscribe({
        next: ( respuesta:any )=>{          
          this.logOracle = respuesta.logs
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
