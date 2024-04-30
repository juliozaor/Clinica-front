import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { Usuario } from '../../modelos/Usuario';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Rol } from '../../modelos/Rol';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from '../../servicios/usuarios.service';
import { marcarFormularioComoSucio } from '../../../utilidades/Utilidades';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-modal-actualizar-usuario',
  templateUrl: './modal-actualizar-usuario.component.html',
  styleUrl: './modal-actualizar-usuario.component.css'
})
export class ModalActualizarUsuarioComponent {
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!: PopupComponent

  @Output('usuarioActualizado') usuarioActualizado: EventEmitter<void>;
  usuario?: Usuario
  formulario: FormGroup
  roles: Rol[] = []

  constructor(private servicioModal: NgbModal, private servicio: UsuariosService){
    this.usuarioActualizado = new EventEmitter<void>();
    this.formulario = new FormGroup({
      nombre: new FormControl(undefined, [ Validators.required ]),
      apellido: new FormControl(undefined),
      identificacion: new FormControl(undefined, [ Validators.required ]),
      fechaNacimiento: new FormControl(undefined),
      correo: new FormControl(""),
      telefono: new FormControl(undefined),
      rol: new FormControl("", [ Validators.required ]),
      usuario: new FormControl("", [ Validators.required ]),
    })
  }

  ngOnInit(): void {
    this.obtenerRoles()
  }

  abrir(usuario: Usuario){
    this.usuario = usuario
    this.rellenarFormulario(usuario)
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  cerrar(){
    this.servicioModal.dismissAll();
  }

  actualizar(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const controls = this.formulario.controls
    this.servicio.actualizar(this.usuario!.usuario, {
      apellido: controls['apellido'].value,
      nombre: controls['nombre'].value,
      correo: controls['correo'].value,
     /*  identificacion: controls['identificacion'].value, */
      idRol: controls['rol'].value,
      telefono: controls['telefono'].value,
      usuario: controls['usuario'].value
    }).subscribe({
      next: ()=>{
        this.usuarioActualizado.emit();
        this.cerrar()
      },
      error: (err)=>{
        this.popup.abrirPopupFallido(err.error.message)
      }
    })
  }

  rellenarFormulario(usuario: Usuario){
    const controls = this.formulario.controls
    controls['apellido'].setValue(usuario.apellido)
    controls['nombre'].setValue(usuario.nombre)
    controls['correo'].setValue(usuario.correo)
    controls['fechaNacimiento'].setValue(
      DateTime.fromISO(usuario.fechaNacimiento).toFormat('yyyy-MM-dd') 
    )
    controls['identificacion'].setValue(usuario.identificacion)
    controls['identificacion'].disable()
    controls['rol'].setValue(usuario.idRol)
    controls['telefono'].setValue(usuario.telefono)
    controls['usuario'].setValue(usuario.usuario)
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('rol')!.setValue("")
  }

  obtenerRoles(){
    this.servicio.listarRoles().subscribe({
      next: (respuesta) => {
        this.roles = respuesta.rols
      }
    })
  }
}
