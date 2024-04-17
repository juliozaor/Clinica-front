import { Component } from '@angular/core';
import { FiltrosLogs } from '../../compartido/modelos/FiltrosLogs';
import { Paginador } from '../../compartido/modelos/Paginador';
import { ArchivosService } from '../archivos.service';
import { Observable } from 'rxjs';
import { Paginacion } from '../../compartido/modelos/Paginacion';
import { FacturaRPA } from '../../compartido/modelos/facturaRPA';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.css',
})
export class FacturasComponent {
  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5;
  paginadorReportes: Paginador<FiltrosLogs>;
  facturaRPA: FacturaRPA[] = [];

  termino: string = '';

  constructor(
    private servicioArchivos: ArchivosService,
    private route: Router
  ) {
    this.paginadorReportes = new Paginador<FiltrosLogs>(this.obtenerFacturas);
  }

  ngOnInit(): void {
    this.paginadorReportes.inicializar(
      this.paginaInicial,
      this.limiteInicial,
      {}
    );
  }
  obtenerFacturas = (pagina: number, limite: number, filtros?: FiltrosLogs) => {
    return new Observable<Paginacion>((sub) => {
      this.servicioArchivos
        .consultarFactura(pagina, limite, filtros)
        .subscribe({
          next: (respuesta: any) => {
            this.facturaRPA = respuesta.facturaRpa;
            sub.next(respuesta.paginacion);
          },
        });
    });
  };

  abrirRegistros(factura: string, rut:string,cod_convenio:number,descripcion_convenio:string) {
    const formulario = {
      factura, rut, cod_convenio, descripcion_convenio
    }
    if (factura != '') {
      this.route.navigate(['/dashboard/archivos/registros', JSON.stringify(formulario)]);
    }
  }

  actualizarFiltros() {
    this.paginadorReportes.filtrar({ termino: this.termino });
  }

  limpiarFiltros() {
    this.termino = '';
    this.paginadorReportes.filtrar({ termino: this.termino });
  }

  setTermino(termino: string) {
    this.termino = termino;
  }
}
