import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { VendedoresService } from '../vendedores/vendedores.service';
import { CrearVisitaDto } from './dtos';
import { Visita, VisitaDocument } from './schemas/visitas.schema';
import { VisitaRespuestaDto } from './dtos/visita-respuesta.dto';
import { VisitaMapper } from './mappers/visita.mapper';
import { FiltrosVisitaDto } from './dtos/filtros/filtros-visita.dto';
import { VisitasPaginadasRespuestaDto } from './dtos/filtros/visita-paginada-respuesta.dto';
import { fechaBoliviaFinUtc, fechaBoliviaInicioUtc } from 'src/common/utils/fecha-bolivia.util';

@Injectable()
export class VisitasService {
  constructor(
    @InjectModel(Visita.name)
    private readonly visitaModel: Model<VisitaDocument>,
    private readonly vendedoresService: VendedoresService,
  ) { }

  async crear(dto: CrearVisitaDto): Promise<VisitaRespuestaDto> {
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

  async obtenerPorId(id: string): Promise<VisitaRespuestaDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`El id '${id}' no tiene un formato válido de MongoDB ObjectId`);
    }

    const visita = await this.visitaModel.findById(id).exec();

    if (!visita) {
      throw new NotFoundException(`Visita con id '${id}' no encontrada`);
    }

    return VisitaMapper.toDto(visita);
  }

  async listar(filtros: FiltrosVisitaDto): Promise<VisitasPaginadasRespuestaDto> {
    const { vendedorId, tipo, desde, hasta, page, limit } = filtros;
    const query: FilterQuery<VisitaDocument> = {};

    if (vendedorId) {
      query.vendedorId = vendedorId;
    }

    if (tipo) {
      query.tipo = tipo;
    }

    if (desde || hasta) {
      query.fecha = {};
      if (desde) {
        query.fecha.$gte = fechaBoliviaInicioUtc (desde);
      }
      if (hasta) {
        query.fecha.$lte = fechaBoliviaFinUtc(hasta);
      }
    }

    const skip = (page - 1) * limit;
    
    const [visitas, total] = await Promise.all([
      this.visitaModel
        .find(query)
        .sort({ fecha: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.visitaModel.countDocuments(query).exec(),
    ]);

    return {
      data: VisitaMapper.toDtoList(visitas),
      page,
      limit,
      total,
    };
  }
}