import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PeticionCrearUsuario } from '../modelos/PeticionCrearUsuario';
import { Autenticable } from '../../services/compartido/Autenticable';
import { PeticionActualizarUsuario } from '../modelos/PeticionActualizarUsuario';
import { FiltrosUsuarios } from '../modelos/FiltrosUsuarios';
import { Usuario } from '../modelos/Usuario';
import { Paginacion } from '../../compartido/modelos/Paginacion';
import { Rol } from '../modelos/Rol';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends Autenticable {

  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) {
    super()
  }

  guardar(peticion: PeticionCrearUsuario){
    const endpoint = 'usuarios/registro'
    return this.http.post(`${this.host}${endpoint}`, peticion, { headers: this.obtenerCabeceraAutorizacion() } )
  }

  actualizar(documento: string, peticion: any){
    const endpoint = `usuarios/${documento}`
    console.log(peticion);
    
    return this.http.patch(`${this.host}${endpoint}`, peticion, { headers: this.obtenerCabeceraAutorizacion() } )
  }

  listar(pagina: number, limite: number, filtros?: FiltrosUsuarios){
    let endpoint = `usuarios/listar?pagina=${pagina}&limite=${limite}`
    if(filtros){
        if(filtros.rol){
            endpoint+=`&rol=${filtros.rol}`
        }
        if(filtros.termino){
            endpoint+=`&termino=${filtros.termino}`
        }
    }
    return this.http.get<{usuarios: Usuario[], paginacion: Paginacion}>(
        `${this.host}${endpoint}`, 
        { headers: this.obtenerCabeceraAutorizacion() 
    })
  }

  listarRoles(){
    const endpoint = 'rol'
    return this.http.get<{rols: Rol[], paginacion: Paginacion}>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  cambiarEstado(id: string){
    const endpoint = `usuarios/${id}`
    return this.http.put(`${this.host}${endpoint}`, '',{ headers: this.obtenerCabeceraAutorizacion() } )
  }

}
