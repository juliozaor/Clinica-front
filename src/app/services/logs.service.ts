import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { FiltrosLogs } from '../compartido/modelos/FiltrosLogs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private urlBackend:string
  headers: HttpHeaders;
  constructor(private http: HttpClient, private auth:AuthService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
   }

   consultar(pagina: number, limite: number, filtros?:FiltrosLogs, tipo?:string) {
    let endpoint = `logs?tipo=${tipo}&pagina=${pagina}&limite=${limite}`;
    if(filtros){
      if(filtros.termino) endpoint+=`&termino=${filtros.termino}`;
      if(filtros.estado) endpoint+=`&estado=${filtros.estado}`;
    }
    return this.http.get(`${this.urlBackend}${endpoint}`,{headers: this.headers})

  }
  
}
