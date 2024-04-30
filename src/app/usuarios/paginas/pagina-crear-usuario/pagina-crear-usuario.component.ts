import { Component, ViewChild } from '@angular/core';
import { ModalActualizarUsuarioComponent } from '../../componentes/modal-actualizar-usuario/modal-actualizar-usuario.component';
import { Paginador } from '../../../compartido/modelos/Paginador';
import { FiltrosUsuarios } from '../../modelos/FiltrosUsuarios';
import { Usuario } from '../../modelos/Usuario';
import { Rol } from '../../modelos/Rol';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from '../../../alertas/componentes/popup/popup.component';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Observable } from 'rxjs';
import { Paginacion } from '../../../compartido/modelos/Paginacion';
import { marcarFormularioComoSucio } from '../../../utilidades/Utilidades';

@Component({
  selector: 'app-pagina-crear-usuario',
  templateUrl: './pagina-crear-usuario.component.html',
  styleUrl: './pagina-crear-usuario.component.css'
})
export class PaginaCrearUsuarioComponent {
  @ViewChild('modalActualizarUsuario') modalActualizarUsuario!: ModalActualizarUsuarioComponent
  @ViewChild('popup') popup!: PopupComponent
  paginador: Paginador<FiltrosUsuarios>
  usuarios: Usuario[] = []
  termino: string = ""
  rol: string = ""
  roles: Rol[] = []
  formulario: FormGroup

  constructor(private servicio:UsuariosService){
    this.paginador = new Paginador<FiltrosUsuarios>(this.obtenerUsuarios)
    this.formulario = new FormGroup({
      nombre: new FormControl(undefined, [ Validators.required ]),
      apellido: new FormControl(undefined),
      identificacion: new FormControl(undefined, [ Validators.required ]),
      fechaNacimiento: new FormControl(undefined),
      correo: new FormControl(""/* , [ Validators.required, Validators.email ] */),
      telefono: new FormControl(undefined),
      rol: new FormControl("", [ Validators.required ]),
      usuario: new FormControl("", [ Validators.required ]),
    })
  }

  ngOnInit(): void {
    this.paginador.inicializar(1, 5)
    this.obtenerRoles()
  }

  obtenerUsuarios = (pagina: number, limite: number, filtros?: FiltrosUsuarios)=>{
    return new Observable<Paginacion>( subscripcion => {
      this.servicio.listar(pagina, limite, filtros).subscribe({
        next: (respuesta)=>{
          this.usuarios = respuesta.usuarios
          subscripcion.next(respuesta.paginacion) 
        }
      })
    })
  }

  manejarUsuarioActualizado(){
    this.paginador.refrescar()
    this.popup.abrirPopupExitoso('Usuario actualizado con éxito.')
  }

  crear(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const controls = this.formulario.controls

    
    
    this.servicio.guardar({
      apellido: controls['apellido'].value,
      nombre: controls['nombre'].value,
      correo: controls['correo'].value,
      fechaNacimiento: controls['fechaNacimiento'].value,
      identificacion: controls['identificacion'].value,
      idRol: controls['rol'].value,
      telefono: controls['telefono'].value,
      usuario: controls['usuario'].value
    }).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso("Usuario creado con éxito.")
        this.paginador.refrescar()
        this.limpiarFormulario()
      },
      error: (err)=>{        
        this.popup.abrirPopupFallido(err.error.message)
      }
    })
  }
  

  actualizarFiltros(){
    this.paginador.filtrar({
      termino: this.termino,
      rol: this.rol
    })
  }

  limpiarFiltros(){
    this.termino = ""
    this.rol = ""
    this.paginador.filtrar({})
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('rol')!.setValue("")
  }

  abrirModalActualizarUsuario(usuario: Usuario){
    this.modalActualizarUsuario.abrir(usuario)
  }

  obtenerRoles(){
    this.servicio.listarRoles().subscribe({
      next: (respuesta) => {
        this.roles = respuesta.rols
      }
    })
  }

  cambiarEstado(id:string){
    this.servicio.cambiarEstado(id).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        
      }
    })
  }

  refrescar(){
    this.paginador.refrescar()
  }
}
