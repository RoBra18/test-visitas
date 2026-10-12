import { ApiProperty } from '@nestjs/swagger';
import { VisitaRespuestaDto } from '../visita-respuesta.dto';

export class VisitasPaginadasRespuestaDto {
  @ApiProperty({ type: [VisitaRespuestaDto] })
  data!: VisitaRespuestaDto[];

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 57 })
  total!: number;
}