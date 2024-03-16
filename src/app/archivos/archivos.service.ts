import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FiltrosLogs } from '../compartido/modelos/FiltrosLogs';
import { environment } from '../../environments/environment';
import { Soporte } from '../compartido/modelos/Soporte';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {
  private urlBackend:string
  headers: HttpHeaders;
  headersForm: HttpHeaders;
  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
    this.headersForm = new HttpHeaders({
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
   }

   consultarFactura(pagina: number, limite: number, filtros?:FiltrosLogs) {
    let endpoint = `archivos/facturas?pagina=${pagina}&limite=${limite}`;
    if(filtros){
      if(filtros.termino) endpoint+=`&termino=${filtros.termino}`;
    }
    return this.http.get(`${this.urlBackend}${endpoint}`,{headers: this.headers})

  }

  consultarRegistros(pagina: number, limite: number, factura:string, filtros?:FiltrosLogs) {
    let endpoint = `archivos/registros?pagina=${pagina}&limite=${limite}&factura=${factura}`;
    if(filtros){
      if(filtros.factura) endpoint+=`&termino=${filtros.factura}`;
    }
    return this.http.get(`${this.urlBackend}${endpoint}`,{headers: this.headers})
  }

  abrirArchivo(nombre: string, factura:string) {
    let endpoint = `archivos?factura=${factura}&nombre=${nombre}`;   
    return this.http.get(`${this.urlBackend}${endpoint}`,{headers: this.headers})
  }

  actualizarArchivo(formData: FormData) {
    let endpoint = `archivos`;   
    return this.http.put(`${this.urlBackend}${endpoint}`,formData, {headers: this.headersForm})
  }

  guardarArchivo(formData: FormData) {
    let endpoint = `archivos`;       
    return this.http.post(`${this.urlBackend}${endpoint}`,formData, {headers: this.headersForm})
  }

  obtenerSoportes() {
    let endpoint = `archivos/soportes`;       
    return this.http.get<{soportes: Soporte[]}>(`${this.urlBackend}${endpoint}`,{headers: this.headersForm})
  }


  eliminarArchivo(nombre: string, factura:string, id:number) {
    let endpoint = `archivos?factura=${factura}&nombre=${nombre}&id=${id}`;   
    return this.http.delete(`${this.urlBackend}${endpoint}`,{headers: this.headers})
  }
}
