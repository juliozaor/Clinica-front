import { Component, ViewChild } from '@angular/core';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FacturaModel } from '../../models/factura.model';
import { FormsService } from '../../services/forms.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CausaModel } from '../../models/causa.model';
import { ModalDetallesComponent } from '../modal-detalles/modal-detalles.component';
import { DetalleModel } from '../../models/detalle.model';

@Component({
  selector: 'app-gestionar',
  templateUrl: './gestionar.component.html',
  styleUrl: './gestionar.component.css',
})
export class GestionarComponent {
  @ViewChild('modalDetalles') modalDetalles!: ModalDetallesComponent;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  mensajeError = {
    estado: false,
    mensaje: '',
  };
  sinDetalle = false;

  causas:CausaModel[] = [];
  
  facturas:FacturaModel[] = [];
  forma:FormGroup;
  forma2:FormGroup;
  parametro:string = ''

  rutPac:string = ''
  codCovenio:string = ''
  convenio:string = ''

  facturasProcesadas: any[] = [];
  facturasPausadas: any[] = [];

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
      this.parametro = params['parametro']; // Nombre del parámetro definido en la ruta
      this.consultarFactura();
    });

  }

  consultarFactura() {
    this.frm.consultarAgrupada(2).subscribe(
      (resp: any) => {
        console.log(resp);
        
        this.facturas = resp;
        this.codCovenio = this.facturas[0].COD_CONVENIO!
        this.convenio = this.facturas[0].CONVENIO!
        this.rutPac = this.facturas[0].RUT_PAC!
        this.mensajeError.estado = false;
       // this.sinDetalle = this.factura.detalles?.length! <= 0;
      },
      (err) => {
        this.mensajeError.estado = true;
        this.mensajeError.mensaje = err.error.text;
      }
    );
  }

  uncheckOther(option: string, facturaId: string) {
    const factura = this.facturas.find(f => f.RPA_FOR_NUMERFORMU === facturaId);
    if (factura) {
      if (option === 'procesar') {
        factura.pausar = false; 
      } else {
        factura.procesar = false; 
      }
    }
  }

  
 async marcarParaCrear(){
  Swal.fire({
    icon:'info',
    allowOutsideClick: false,      
    text: 'Espere por favor...',
  });
  Swal.showLoading();
  
    this.validarYSepararFacturas()
    if(this.facturasProcesadas.length > 0){
      const padre = this.facturasProcesadas[0].RPA_FOR_NUMERFORMU;
      this.facturasProcesadas.map(f=>{
        f.RPA_FOR_NUMERFORMU_PID = padre;

      })
     await this.actualizar(1,5, this.facturasProcesadas);
    }
    if(this.facturasPausadas.length >0){
     await this.actualizar(1,10, this.facturasPausadas);
    }
    Swal.close();  
    await Swal.fire({
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
        
        this.limpiar()
        this.consultarFactura();
      }
      if (result.isDismissed) {
        this.route.navigate(['/dashboard/home']); 
      }
      
    });

    
  }
  

  
  async actualizaFactura(){
    if (this.forma.invalid) {
      this.marcarFormularioComoSucio(1)
      return;
    }    

    Swal.fire({
      icon:'info',
      allowOutsideClick: false,      
      text: 'Espere por favor...',
    });
    Swal.showLoading();
    this.validarYSepararFacturas()
    if(this.facturasProcesadas.length > 0){
      const nFactura = this.forma.controls['nfactura'].value.toString();
      this.facturasProcesadas.map(f=>{
        f.nfactura = nFactura;
      })
     this.actualizar(1,9, this.facturasProcesadas);
    }
    if(this.facturasPausadas.length >0){
      this.actualizar(1,10, this.facturasPausadas);
    }
    
    Swal.close();  
    await Swal.fire({
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
        
        this.limpiar()
        this.consultarFactura();
      }
      if (result.isDismissed) {
        this.route.navigate(['/dashboard/home']); 
      }
      
    });
    
  }
  
  
 async eliminarFormulario(){
    if (this.forma2.invalid) {
      this.marcarFormularioComoSucio(2)
      return;
    }

    Swal.fire({
      icon:'info',
      allowOutsideClick: false,      
      text: 'Espere por favor...',
    });
    Swal.showLoading();

   this.validarYSepararFacturas()
    if(this.facturasProcesadas.length > 0){
      const causalId = this.forma2.controls['causalid'].value;
      this.facturasProcesadas.map(f=>{
        f.causalid = causalId;
      })
      this.actualizar(3,-1, this.facturasProcesadas);
    }
    if(this.facturasPausadas.length >0){
      this.actualizar(1,10, this.facturasPausadas);
    }

    Swal.close();  
    await Swal.fire({
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
        
        this.limpiar()
        this.consultarFactura();
      }
      if (result.isDismissed) {
        this.route.navigate(['/dashboard/home']); 
      }
      
    });   
    
  
  }

  public limpiar(): void {
    this.forma.reset()
    this.forma2.reset()
  }

 async actualizar(boton: number, estado: number, facturasArray:any[]) {     
    this.frm.actualizarAgrupadas(estado, boton, facturasArray).subscribe(
      (resp: any) => {           
        console.log("Entro 11");    
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

  validarYSepararFacturas() {
    // Reiniciar las listas
    this.facturasProcesadas = [];
    this.facturasPausadas = [];
  
    // Validar y separar facturas
    for (let factura of this.facturas) {
      if (factura.procesar) {
        this.facturasProcesadas.push(factura);
      } else if (factura.pausar) {
        this.facturasPausadas.push(factura);
      }
    }
  
    
  }

  modalDetalle(detalles:DetalleModel[]){
    this.modalDetalles.openModal(detalles);
    
  }
  

}
