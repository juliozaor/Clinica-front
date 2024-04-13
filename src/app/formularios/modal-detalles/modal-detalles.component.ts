import { Component, ElementRef, ViewChild } from '@angular/core';
import { DetalleModel } from '../../models/detalle.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-detalles',
  templateUrl: './modal-detalles.component.html',
  styleUrl: './modal-detalles.component.css'
})
export class ModalDetallesComponent {
  @ViewChild('modal') modal!: ElementRef;
  detalles?:DetalleModel[]
formulario?:string
sinDetalle = false;
  constructor(
    private serviceModal: NgbModal
  ) {
    
  }

  openModal(detalles: DetalleModel[]) {
    this.detalles = detalles;
    this.sinDetalle = this.detalles?.length! <= 0;
    this.formulario = detalles[0].RPA_FOR_NUMERFORMU
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  
}
