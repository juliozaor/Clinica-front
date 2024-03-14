import { Component, ViewChild } from '@angular/core';
import { ModalVerArchivoComponent } from '../modal-ver-archivo/modal-ver-archivo.component';
import { ActivatedRoute } from '@angular/router';
import { FiltrosLogs } from '../../compartido/modelos/FiltrosLogs';
import { Observable } from 'rxjs';
import { Paginacion } from '../../compartido/modelos/Paginacion';
import { ArchivosService } from '../archivos.service';
import { Paginador } from '../../compartido/modelos/Paginador';
import { RegistroRPA } from '../../compartido/modelos/RegstroRPA';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalActualizarArchivoComponent } from '../modal-actualizar-archivo/modal-actualizar-archivo.component';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.css'
})
export class RegistrosComponent {
  @ViewChild('modalVerArchivo') modalVerArchivo!: ModalVerArchivoComponent
  @ViewChild('modalActualizarArchivo') modalActualizarArchivo!: ModalActualizarArchivoComponent
  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5;
  paginadorReportes: Paginador<FiltrosLogs>;
  registroRpa: RegistroRPA[] = [];
  factura:string = ''
  termino:string = ''
  archivoBase64: string = ''
  rol:string=''

constructor(private servicioArchivos: ArchivosService, private routeActive: ActivatedRoute, private sanitizer: DomSanitizer){
  this.routeActive.params.subscribe(params => {
    this.factura = params['factura']; // Nombre del parámetro definido en la ruta
    //this.consultarFactura();
    console.log(this.factura);
    
  });
  this.paginadorReportes = new Paginador<FiltrosLogs>(this.obtenerRegistros);
}

ngOnInit() { 
  this.paginadorReportes.inicializar(
    this.paginaInicial,
    this.limiteInicial,
    {}
  );
this.rol = localStorage.getItem('rol')??'';


}

obtenerRegistros = (pagina: number, limite: number, filtros?: FiltrosLogs) => {
  return new Observable<Paginacion>((sub) => {
    this.servicioArchivos
      .consultarRegistros(pagina, limite, this.factura, filtros)
      .subscribe({
        next: (respuesta: any) => {
          this.registroRpa = respuesta.registroRpa;
          sub.next(respuesta.paginacion);
        },
      });
  });
};

obtenerArchivo(nombre:string, factura:string, tipo:number){
  this.servicioArchivos
  .abrirArchivo(nombre, factura)
  .subscribe({
    next: (respuesta: any) => {
      if(respuesta.archivo){
        if (tipo == 1) {
          this.modalVerArchivo.abrir(respuesta.archivo)           
        }
        if (tipo == 2) {
          this.archivoBase64 = `${respuesta.archivo}`
          this.descargarArchivo(nombre)
        }
      }
    },
  });
}
descargarArchivo(nombre:string) {
  // Convierte el archivo base64 a un blob
  const byteCharacters = atob(this.archivoBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  // Crea un enlace de descarga
  const url = window.URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `${nombre}.pdf`; // Nombre del archivo a descargar

  // Simula hacer clic en el enlace para descargar el archivo
  enlace.click();

  // Libera el objeto URL creado
  window.URL.revokeObjectURL(url);
}

actualizarArchivo(nombre:string, factura:string){
  this.modalActualizarArchivo.abrir(nombre,factura)     
}

eliminarArchivo(nombre:string, factura:string){
  this.servicioArchivos
  .eliminarArchivo(nombre, factura)
  .subscribe({
    next: (respuesta: any) => {
      console.log(respuesta);
      
    },
  });
}

actualizarFiltros() {
  this.paginadorReportes.filtrar({ termino: this.termino });
}

limpiarFiltros() {
  this.termino = '';
  this.paginadorReportes.filtrar({ termino: this.termino });
}

setTermino(termino: string) {
  this.termino = termino;
}

}
