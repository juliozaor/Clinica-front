import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-modal-ver-archivo',
  templateUrl: './modal-ver-archivo.component.html',
  styleUrl: './modal-ver-archivo.component.css'
})
export class ModalVerArchivoComponent {
  @ViewChild('modal') modal!: ElementRef
  pdfBase64?:any;

  constructor(private servicioModal: NgbModal, private sanitizer: DomSanitizer){}

  abrir(archivo:any){
    const urlSegura = `data:application/pdf;base64,  ${archivo}` 
    this.pdfBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(urlSegura);
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  cerrar(){
    this.servicioModal.dismissAll();
  }
}
