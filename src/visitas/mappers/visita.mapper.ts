import { VisitaRespuestaDto } from "../dtos/visita-respuesta.dto";
import { VisitaDocument } from "../schemas/visitas.schema";

export class VisitaMapper {
  static toDto(doc: VisitaDocument | any): VisitaRespuestaDto {
    return {
      id: doc._id?.toString() ?? doc.id,
      vendedorId: doc.vendedorId,
      clienteId: doc.clienteId,
      tipo: doc.tipo,
      fecha: doc.fecha,
      ubicacion: {
        lat: doc.ubicacion.lat,
        lng: doc.ubicacion.lng,
      },
      notas: doc.notas,
      detalle: doc.detalle,
      creadaEn: doc.creadaEn,
    };
  }

  static toDtoList(docs: (VisitaDocument | any)[]): VisitaRespuestaDto[] {
    return docs.map((doc) => VisitaMapper.toDto(doc));
  }
}