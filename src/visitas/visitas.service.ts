import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VendedoresService } from '../vendedores/vendedores.service';
import { CrearVisitaDto } from './dtos';
import { Visita, VisitaDocument } from './schemas/visitas.schema';
import { VisitaRespuestaDto } from './dtos/visita-respuesta.dto';
import { VisitaMapper } from './mappers/visita.mapper';

@Injectable()
export class VisitasService {
  constructor(
    @InjectModel(Visita.name)
    private readonly visitaModel: Model<VisitaDocument>,
    private readonly vendedoresService: VendedoresService,
  ) { }

  async crear(dto: CrearVisitaDto) : Promise<VisitaRespuestaDto> {
    const vendedor = await this.vendedoresService.obtener(dto.vendedorId);

    if (!vendedor.activo) {
      throw new ConflictException(`El vendedor ${dto.vendedorId} está inactivo`);
    }

    const nuevaVisita = new this.visitaModel({
      ...dto,
      fecha: new Date(dto.fecha),
      creadaEn: new Date()
    });

    const guardada = await nuevaVisita.save();
    return VisitaMapper.toDto(guardada.toJSON());
  }

  async obtenerPorId(id: string) : Promise<VisitaRespuestaDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`El id '${id}' no tiene un formato válido de MongoDB ObjectId`);
    }

    const visita = await this.visitaModel.findById(id).exec();

    if (!visita) {
      throw new NotFoundException(`Visita con id '${id}' no encontrada`);
    }

    return VisitaMapper.toDto(visita);
  }
}