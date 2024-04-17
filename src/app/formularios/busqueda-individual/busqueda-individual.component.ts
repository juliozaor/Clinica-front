import { Component } from '@angular/core';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';
import { FacturaModel } from '../../models/factura.model';
import { CausaModel } from '../../models/causa.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsService } from '../../services/forms.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-busqueda-individual',
  templateUrl: './busqueda-individual.component.html',
  styleUrl: './busqueda-individual.component.css'
})
export class BusquedaIndividualComponent {
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  mensajeError = {
    estado: false,
    mensaje: '',
  };
  sinDetalle = false;

  causas:CausaModel[] = [];
  
  factura: FacturaModel = new FacturaModel();
  forma:FormGroup;
  forma2:FormGroup;
  parametro:string = ''

  constructor(private frm: FormsService, private routeActive: ActivatedRoute, private route:Router) {
    this.forma = new FormGroup({
      'nfactura': new FormControl('' , [Validators.required])
    })
    this.forma2 = new FormGroup({
      'causalid': new FormControl('' , [Validators.required])
    })
  }

  ngOnInit() {
    this.cargarCausas();
    
    this.routeActive.params.subscribe(params => {
      this.factura = JSON.parse(params['formulario']);
      this.sinDetalle = this.factura.detalles?.length! <= 0;
    });

  }
  
  actualizaFactura(){
    if (this.forma.invalid) {
      this.marcarFormularioComoSucio(1)
      return;
    }
    this.factura.nfactura = this.forma.controls['nfactura'].value.toString();
    this.actualizar(1,9);
    
  }
  
  
  eliminarFormulario(){
    if (this.forma2.invalid) {
      this.marcarFormularioComoSucio(2)
      return;
    }
    this.factura.causalid = this.forma2.controls['causalid'].value;
    this.actualizar(3,-1);
    
  
  }

  public limpiar(): void {
    this.forma.reset()
    this.forma2.reset()
  }

  actualizar(boton: number, estado: number) {
      Swal.fire({
      icon:'info',
      allowOutsideClick: false,      
      text: 'Espere por favor...',
    });
    Swal.showLoading();
    this.frm.actualizar(estado, boton, this.factura).subscribe(
      (resp: any) => {
        Swal.close();
        Swal.fire({
          //title: "Actualización",
          text: "El formulario se actualizó correctamente, ¿desea cargar un nuevo formulario?",
          icon: "info",
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Cargar formulario",
          cancelButtonText:"Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            this.route.navigate(['/dashboard/formulario/busqueda']);
          }
          if (result.isDismissed) {
            this.route.navigate(['/dashboard/home']); 
          }
          
        });
        this.limpiar()
      },
      (err) => {
        console.log({ err });
        Swal.close();
      }
    );
  }

  public marcarFormularioComoSucio(n:number): void {
    if(n == 1){
      
      (<any>Object).values(this.forma.controls).forEach((control: FormControl) => {
        control.markAsDirty();
        if (control) {
          control.markAsDirty()
        }
      });
    }
    if(n == 2){
      
      (<any>Object).values(this.forma2.controls).forEach((control: FormControl) => {
        control.markAsDirty();
        if (control) {
          control.markAsDirty()
        }
      });
    }

  }
  

  public cargarCausas() {
    this.frm.causas().subscribe(
      (resp: any) => {
        this.causas = resp
      },
      (err) => {
        console.log(err);
      }
    );
  }

  regresar(){
    this.route.navigate(['/dashboard/formulario/busqueda']);
  }
}
