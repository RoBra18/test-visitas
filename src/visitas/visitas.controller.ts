import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { VisitasService } from './visitas.service';
import { CrearVisitaDto } from './dtos';
import {  VisitaRespuestaDto } from './dtos/visita-respuesta.dto';
import { SWAGGER_BODY_EXAMPLES, SWAGGER_RESPONSE_EXAMPLES } from './docs/visitas-swagger.examples';

@ApiTags('visitas')
@Controller('visitas')
export class VisitasController {
  constructor(private readonly visitasService: VisitasService) { }

  @Post()
@HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registra una nueva visita de campo' })
  @ApiBody({
    type: CrearVisitaDto,
    description: 'Datos de la visita. Selecciona un ejemplo en el selector para ver cada variante (VENTA, COBRANZA, RECLAMO).',
    examples: SWAGGER_BODY_EXAMPLES,
  })
  @ApiCreatedResponse({
    type: VisitaRespuestaDto,
    description: 'Visita registrada exitosamente con id y creadaEn',
    content: {
      'application/json': {
        examples: SWAGGER_RESPONSE_EXAMPLES,
      },
    },
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


  @ApiOperation({
    summary: 'Consultar una visita',
    description: 'Devuelve una visita por su identificador único (MongoDB ObjectId).',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único de la visita (ObjectId)',
    example: '6accc9ec46a427545973f069',
  })
  @ApiOkResponse({
    description: 'Visita encontrada exitosamente',
    type: VisitaRespuestaDto,
  })
  @ApiBadRequestResponse({
    description: 'El id proporcionado no tiene un formato válido de MongoDB ObjectId',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró la visita con el id especificado',
  })
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) : Promise<VisitaRespuestaDto> {
    return this.visitasService.obtenerPorId(id);
  }
}