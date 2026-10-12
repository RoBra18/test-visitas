import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsISO8601,
  isISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UbicacionDto } from './ubicacion.dto';
import {
  DetalleCobranzaDto,
  DetalleReclamoDto,
  DetalleVentaDto,
} from './detalles';
import { TipoVisita } from '../schemas/visitas.schema';

export class CrearVisitaDto {
  @ApiProperty({ example: 'V001' })
  @IsString()
  @IsNotEmpty()
  vendedorId!: string;

  @ApiProperty({ example: 'CLI-100' })
  @IsString()
  @IsNotEmpty()
  clienteId!: string;

  @ApiProperty({ enum: TipoVisita, example: TipoVisita.VENTA })
  @IsEnum(TipoVisita)
  tipo!: TipoVisita;

  @ApiProperty({ example: '2026-10-01T14:30:00.000Z' })
  @IsDateString()
  @IsISO8601()
  
  fecha!: string;

  @ApiProperty({ type: UbicacionDto })
  @ValidateNested()
  @Type(() => UbicacionDto)
  ubicacion!: UbicacionDto;

  @ApiPropertyOptional({ example: 'Visita de seguimiento trimestral' })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiProperty({
    description: 'Estructura variable según tipo: VENTA, COBRANZA o RECLAMO',
  })
  @ValidateNested()
  @Type((opts) => {
    const tipo = opts?.newObject?.tipo;
    if (tipo === TipoVisita.VENTA) return DetalleVentaDto;
    if (tipo === TipoVisita.COBRANZA) return DetalleCobranzaDto;
    if (tipo === TipoVisita.RECLAMO) return DetalleReclamoDto;
    return Object;
  })
  detalle!: DetalleVentaDto | DetalleCobranzaDto | DetalleReclamoDto;
}