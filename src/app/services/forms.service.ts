import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { FacturaModel } from '../models/factura.model';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  private urlBackend:string
  headers: HttpHeaders;

  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  consultar(estado: number, parametro:string) {
    const endpoint = `facturas?estado=${estado}&parametro=${parametro}`;
    return this.http.get(`${this.urlBackend}${endpoint}`,{headers: this.headers})
  }

  consultarAgrupada(estado: number) {
    const endpoint = `facturas/agrupadas?estado=${estado}`;
    return this.http.get(`${this.urlBackend}${endpoint}`,{headers: this.headers})
  }

  actualizar(estado: number, boton:number, factura:FacturaModel) {
    delete factura.detalles    
    const endpoint = `facturas/${estado}/${boton}`;
    return this.http.patch(`${this.urlBackend}${endpoint}`,factura, {headers: this.headers})
  }

  actualizarAgrupadas(estado: number, boton:number, factura:FacturaModel[]) {
    const endpoint = `facturas/agrupados/${estado}/${boton}`;
    return this.http.patch(`${this.urlBackend}${endpoint}`,factura, {headers: this.headers})
  }

  causas() {
    const endpoint = `facturas/causas`;
    return this.http.get(`${this.urlBackend}${endpoint}`,{headers: this.headers})
  }


}
