import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReportesService } from './reportes.service';
import { ReporteDiaRespuestaDto } from './dtos/reporte-dia-respuesta.dto';
import { ReporteVisitasPorDiaQueryDto } from './dtos/reporte-visitas-por-dia-query.dto';

@ApiTags('reportes')
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) { }

  @Get('visitas-por-dia')
  @ApiOperation({
    summary: 'Reporte diario de visitas por vendedor',
    description:
      'Calcula en MongoDB la cantidad de visitas por día agrupadas en hora de Bolivia (UTC-4), desglosadas por tipo (VENTA, COBRANZA, RECLAMO).',
  })
  @ApiOkResponse({
    description: 'Reporte ordenado por fecha ascendente',
    type: [ReporteDiaRespuestaDto],
  })
  @ApiBadRequestResponse({
    description: 'Parámetros obligatorios faltantes o con formato inválido',
  })
  async obtenerVisitasPorDia( @Query() query: ReporteVisitasPorDiaQueryDto): Promise<ReporteDiaRespuestaDto[]> {
    return this.reportesService.obtenerVisitasPorDia(query);
  }
}