import { Component } from '@angular/core';
import { LogRobot } from '../../compartido/modelos/LogRobot';
import { Paginador } from '../../compartido/modelos/Paginador';
import { FiltrosLogs } from '../../compartido/modelos/FiltrosLogs';
import { LogsService } from '../../services/logs.service';
import { Observable } from 'rxjs';
import { Paginacion } from '../../compartido/modelos/Paginacion';

@Component({
  selector: 'app-log-robot',
  templateUrl: './log-robot.component.html',
  styleUrl: './log-robot.component.css'
})
export class LogRobotComponent {

  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5
  paginadorReportes: Paginador<FiltrosLogs>
  logRobot: LogRobot[] = []

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
      this.servicioLogs.consultar(pagina, limite, filtros, '3' ).subscribe({
        next: ( respuesta:any )=>{          
          this.logRobot = respuesta.logs
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
