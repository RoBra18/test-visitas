import { ApiProperty, ApiPropertyOptional, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { DetalleCobranzaDto, DetalleReclamoDto, DetalleVentaDto } from './detalles';
import { TipoVisita } from '../schemas/visitas.schema';
import { UbicacionDto } from './ubicacion.dto';


@ApiExtraModels(DetalleVentaDto, DetalleCobranzaDto, DetalleReclamoDto)
export class VisitaRespuestaDto {
  @ApiProperty({ example: '6accc9ec46a427545973f069' })
  id!: string;

  @ApiProperty({ example: 'V001' })
  vendedorId!: string;

  @ApiProperty({ example: 'CLI-100' })
  clienteId!: string;

  @ApiProperty({ enum: TipoVisita, example: TipoVisita.VENTA })
  tipo!: TipoVisita;

  @ApiProperty({ example: '2026-10-01T14:30:00.000Z' })
  fecha!: Date;

  @ApiProperty({ type: UbicacionDto })
  ubicacion!: UbicacionDto;

  @ApiPropertyOptional({ example: 'Cliente interesado en renovar equipos' })
  notas?: string;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(DetalleVentaDto) },
      { $ref: getSchemaPath(DetalleCobranzaDto) },
      { $ref: getSchemaPath(DetalleReclamoDto) },
    ],
  })
  detalle!: DetalleVentaDto | DetalleCobranzaDto | DetalleReclamoDto;

  @ApiProperty({ example: '2026-10-12T11:52:12.873Z' })
  creadaEn!: Date;
}