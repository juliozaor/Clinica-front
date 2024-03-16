export interface LogForm{
 id?: string;
  usuario: string;
  rol: string;
  rpa_for_numerformu: string;
  accion_id: number;
  estado: number;
  creacion: string;
  accion?: {
    accion: string
}
}