import { Component } from '@angular/core';
import { LogForm } from '../../compartido/modelos/LogForms';
import { LogsService } from '../../services/logs.service';
import { Paginador } from '../../compartido/modelos/Paginador';
import { FiltrosLogs } from '../../compartido/modelos/FiltrosLogs';
import { Observable } from 'rxjs';
import { Paginacion } from '../../compartido/modelos/Paginacion';

@Component({
  selector: 'app-log-form',
  templateUrl: './log-form.component.html',
  styleUrl: './log-form.component.css'
})
export class LogFormComponent {

  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5
  paginadorReportes: Paginador<FiltrosLogs>
  logForm: LogForm[] = []

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
      this.servicioLogs.consultar(pagina, limite, filtros, '2' ).subscribe({
        next: ( respuesta:any )=>{          
          this.logForm = respuesta.logs
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
