import { Component, ViewChild } from '@angular/core';
import { LogsService } from '../../services/logs.service';
import { Formulario } from '../../compartido/modelos/Formulario';
import { FiltrosLogs } from '../../compartido/modelos/FiltrosLogs';
import { Paginador } from '../../compartido/modelos/Paginador';
import { Observable } from 'rxjs';
import { Paginacion } from '../../compartido/modelos/Paginacion';

@Component({
  selector: 'app-log-estado-formulario',
  templateUrl: './log-estado-formulario.component.html',
  styleUrl: './log-estado-formulario.component.css'
})
export class LogEstadoFormularioComponent {
  @ViewChild('selectorEstado') selectorEstado: any;
  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5
  paginadorReportes: Paginador<FiltrosLogs>
  formularios: Formulario[] = []
  estadoSeleccionado:string = "0"

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
      this.servicioLogs.consultar(pagina, limite, filtros, '5' ).subscribe({
        next: ( respuesta:any )=>{          
          this.formularios = respuesta.logs
          sub.next(respuesta.paginacion)
          console.log(this.formularios);
          
        }
      })
    })
  }

  actualizarFiltros(){
    this.paginadorReportes.filtrar({ termino: this.termino, estado: this.estadoSeleccionado })
  }

  limpiarFiltros(){
    this.termino = ""
    this.estadoSeleccionado = "0"
    this.reiniciarSelector()
    this.paginadorReportes.filtrar({ termino: this.termino, estado: this.estadoSeleccionado })
  }

  setTermino(termino: string){
    this.termino = termino
  }

  seleccionarEstado(seleccion: string){
    this.estadoSeleccionado = seleccion  
  
  }

  reiniciarSelector() {
    this.selectorEstado.nativeElement.value = "0";
  }

}
