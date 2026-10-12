import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { TipoVisita } from '../../schemas/visitas.schema';

export class FiltrosVisitaDto {
  @ApiPropertyOptional({ description: 'ID del vendedor', example: 'V001' })
  @IsOptional()
  @IsString()
  vendedorId?: string;

  @ApiPropertyOptional({ enum: TipoVisita, description: 'Tipo de visita' })
  @IsOptional()
  @IsEnum(TipoVisita)
  tipo?: TipoVisita;

  @ApiPropertyOptional({
    description: 'Fecha inicio YYYY-MM-DD (hora Bolivia, inclusive)',
    example: '2026-10-01',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'desde debe tener el formato YYYY-MM-DD',
  })
  desde?: string;

  @ApiPropertyOptional({
    description: 'Fecha fin YYYY-MM-DD (hora Bolivia, inclusive)',
    example: '2026-10-31',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'hasta debe tener el formato YYYY-MM-DD',
  })
  hasta?: string;

  @ApiPropertyOptional({ description: 'Número de página', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad por página',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
