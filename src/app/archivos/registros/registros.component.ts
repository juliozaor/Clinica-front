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
import { ModalGuardarArchivoComponent } from '../modal-guardar-archivo/modal-guardar-archivo.component';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.css'
})
export class RegistrosComponent {
  @ViewChild('modalVerArchivo') modalVerArchivo!: ModalVerArchivoComponent
  @ViewChild('modalActualizarArchivo') modalActualizarArchivo!: ModalActualizarArchivoComponent
  @ViewChild('modalGuardarArchivo') modalGuardarArchivo!: ModalGuardarArchivoComponent
  @ViewChild('popup') popup!: PopupComponent
  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5;
  paginadorReportes: Paginador<FiltrosLogs>;
  registroRpa: RegistroRPA[] = [];
  factura:string = ''
  rut: string = ''
  convenio: string = ''
  desc_convenio = ''
  termino:string = ''
  archivoBase64: string = ''
  rol:string=''
  estadoRol:boolean = false;

constructor(private servicioArchivos: ArchivosService, private routeActive: ActivatedRoute, private sanitizer: DomSanitizer){
  this.routeActive.params.subscribe(params => {
    const ArrayParams = JSON.parse(params['formulario'])
    this.factura = ArrayParams.factura;
    this.rut = ArrayParams.rut;
    this.convenio = ArrayParams.cod_convenio;
    this.desc_convenio = ArrayParams.descripcion_convenio;

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
if(this.rol == '008' || this.rol == '012' || this.rol == '013' || this.rol == '014' || this.rol == '015' || this.rol == '016'){
  this.estadoRol = true
}

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
      }else{
        this.popup.abrirPopupFallido(respuesta.mensaje)
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

guardarArchivo(){
  this.modalGuardarArchivo.abrir(this.factura)     
}

eliminarArchivo(nombre:string, factura:string, id:number){
  Swal.fire({
    //title: "Actualización",
    text: "Esta seguro que sesea eliminar el archivo?",
    icon: "info",
    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText:"Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon:'info',
        allowOutsideClick: false,      
        text: 'Espere por favor...',
      });
      Swal.showLoading();

      this.servicioArchivos
      .eliminarArchivo(nombre, factura, id)
      .subscribe({
        next: (respuesta: any) => {
          Swal.close();
          this.popup.abrirPopupExitoso(respuesta.mensaje)
          this.paginadorReportes.refrescar()
        },
        error: (err)=>{        
          Swal.close();
          
          this.popup.abrirPopupFallido(err.error.text)
        }
      });
    }
   
    
  });

 
}

manejarRegistroCreado(){
  this.paginadorReportes.refrescar()
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
