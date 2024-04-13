import { DetalleModel } from "./detalle.model";

export class FacturaModel {
  RUT_PAC?:string;
  COD_CONVENIO?:string;
  CONVENIO?:string;
  AMBITO?:string;
  RPA_FOR_FECHADIGIT?:string;
  RPA_FOR_NUMERFORMU?:string;
  RPA_FOR_FECHATENCION?:string;
  VALORCTA?:number;
  CODIGOCENTROATEN?:string;
  estadoId?:number;
  nfactura?:string;
  causalid?:string;
  detalles?: DetalleModel[];
  RPA_FOR_NUMERFORMU_PID?:string
  procesar:boolean =false;
  pausar:boolean = false;

} 