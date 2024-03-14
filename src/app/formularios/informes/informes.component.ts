import { Component } from '@angular/core';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.css'
})
export class InformesComponent {
  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5

  logSeleccionado:string = "1"

  termino: string = ""



 
  seleccionarLog(seleccion: string){
    this.logSeleccionado = seleccion  
  
  }

 


}
