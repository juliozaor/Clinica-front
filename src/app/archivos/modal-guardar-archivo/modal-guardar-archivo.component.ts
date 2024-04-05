import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArchivosService } from '../archivos.service';
import { Soporte } from '../../compartido/modelos/Soporte';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-guardar-archivo',
  templateUrl: './modal-guardar-archivo.component.html',
  styleUrl: './modal-guardar-archivo.component.css'
})
export class ModalGuardarArchivoComponent {
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!: PopupComponent
  @Output('registroCreado') registroCreado: EventEmitter<void>;
  tiposoporte: string = '';
  factura:string='';
  archivoSeleccionado: File | null = null;
  soportes: Soporte[] = []
  formulario: FormGroup
  constructor(private servicioModal: NgbModal, private servicioArchivos: ArchivosService){
    this.registroCreado = new EventEmitter<void>();
    this.formulario = new FormGroup({
      tiposoporte: new FormControl("", [ Validators.required ])
    })
  }

  ngOnInit(): void {
    this.obtenerSoportes()
  }
  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }

  cargarArchivo() {
    if (!this.archivoSeleccionado) {
      console.error('No se ha seleccionado un archivo');
      this.popup.abrirPopupFallido("Seleccione un archivo.", "No se ha seleccionado un archivo")
      return;
    }
    
    const controls = this.formulario.controls
    this.tiposoporte = controls['tiposoporte'].value    
    if(this.tiposoporte == '' || this.tiposoporte == undefined){
      this.popup.abrirPopupFallido("Seleccione un soporte.", "Tipo de soporte es obligatorio")
      return;
    }

    Swal.fire({
      icon:'info',
      allowOutsideClick: false,      
      text: 'Espere por favor...',
    });
    Swal.showLoading();

    const formData = new FormData()
    formData.append('archivo', this.archivoSeleccionado);
    formData.append('tiposoporte', this.tiposoporte);
    formData.append('factura', this.factura);

    this.servicioArchivos
      .guardarArchivo(formData)
      .subscribe({
        next: (respuesta: any) => {
          Swal.close();
          this.popup.abrirPopupExitoso(respuesta.mensaje)
          this.registroCreado.emit();
          this.cerrar();          
        },
      });
    
  }

  obtenerSoportes(){
    this.servicioArchivos.obtenerSoportes().subscribe({
      next: (respuesta) => {
        
        this.soportes = respuesta.soportes
      }
    })
  }

  abrir(factura:string){
    this.factura = factura
    
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  cerrar(){
    this.servicioModal.dismissAll();
  }
}
