import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { VisitasService } from './visitas.service';
import { CrearVisitaDto } from './dtos';

@ApiTags('visitas')
@Controller('visitas')
export class VisitasController {
  constructor(private readonly visitasService: VisitasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registra una nueva visita de campo' })
  @ApiCreatedResponse({
    description: 'Visita registrada exitosamente con id y creadaEn',
  })
  @ApiBadRequestResponse({
    description:
      'Body inválido (campos requeridos faltantes, tipos incorrectos o detalle incompatible con el tipo)',
  })
  @ApiNotFoundResponse({
    description: 'El vendedor no existe',
  })
  @ApiConflictResponse({
    description: 'El vendedor existe pero está inactivo',
  })
  crear(@Body() dto: CrearVisitaDto) {
    return this.visitasService.crear(dto);
  }
}