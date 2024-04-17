import { Component } from '@angular/core';
import { Paginador } from '../../compartido/modelos/Paginador';
import { FiltrosLogs } from '../../compartido/modelos/FiltrosLogs';
import { FacturaModel } from '../../models/factura.model';
import { FormsService } from '../../services/forms.service';
import { Observable } from 'rxjs';
import { Paginacion } from '../../compartido/modelos/Paginacion';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent {

  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5
  paginadorReportes: Paginador<FiltrosLogs>
  formularios: FacturaModel[] = []

  termino: string = ""

  constructor(
    private servicioFormulario: FormsService, private route: Router
  ){ 
   
    this.paginadorReportes = new Paginador<FiltrosLogs>(this.obtenerFormularios)    
  }

  ngOnInit(): void {
    this.paginadorReportes.inicializar(this.paginaInicial, this.limiteInicial, {})
  }
  obtenerFormularios = (pagina: number, limite: number, filtros?:FiltrosLogs)=>{
    return new Observable<Paginacion>( sub => {
      this.servicioFormulario.buscar(pagina, limite, filtros ).subscribe({
        next: ( respuesta:any )=>{                    
          this.formularios = respuesta.formularios
          sub.next(respuesta.paginacion)
        }
      })
    })
  }

  analizarFormulario(formularioId:string, rut: string){
    Swal.fire({
      icon:'info',
      allowOutsideClick: false,      
      text: 'Espere por favor...',
    });
    Swal.showLoading();
      this.servicioFormulario.obtenerBusqueda(formularioId, rut ).subscribe({
        next: ( respuesta:any )=>{ 
          Swal.close();
          const tipo = respuesta.tipo;
          const estado = respuesta.estado;                   
          const formularios = respuesta.formularios
         if(estado == 1){
          if(tipo === 'INDIVIDUAL'){
            console.log("Abrir individual");
            this.route.navigate(['/dashboard/formulario/busquedaIndividual', JSON.stringify(formularios[0])]);
          }
          if(tipo === 'AGRUPADO'){
            console.log("Abrir agrupado");
            this.route.navigate(['/dashboard/formulario/busquedaGrupal', JSON.stringify(formularios)]);
          }
          console.log(formularios);

         }else{
          console.log("Formulario no encontrado");

          //poppup
         }
         
        }
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
