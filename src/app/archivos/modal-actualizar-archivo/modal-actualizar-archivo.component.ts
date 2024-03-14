import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArchivosService } from '../archivos.service';

@Component({
  selector: 'app-modal-actualizar-archivo',
  templateUrl: './modal-actualizar-archivo.component.html',
  styleUrl: './modal-actualizar-archivo.component.css'
})
export class ModalActualizarArchivoComponent {
  @ViewChild('modal') modal!: ElementRef
  nombre:string=''
  factura:string=''
  tipoSoporte: string = '';
  archivoSeleccionado: File | null = null;

  constructor(private servicioModal: NgbModal, private servicioArchivos: ArchivosService){

  }
  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }

  cargarArchivo() {
    if (!this.archivoSeleccionado) {
      console.error('No se ha seleccionado un archivo');
      return;
    }

    const formData = new FormData()
    formData.append('archivo', this.archivoSeleccionado);
    formData.append('nombre', this.nombre);
    formData.append('factura', this.factura);
    formData.append('tipoSoporte', this.tipoSoporte);

    this.servicioArchivos
      .actualizarArchivo(formData)
      .subscribe({
        next: (respuesta: any) => {
          console.log(respuesta);
          this.cerrar();          
        },
      });
    
  }

  abrir(nombre:string, factura:string){
    this.nombre = nombre
    this.factura = factura
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  cerrar(){
    this.servicioModal.dismissAll();
  }
}
