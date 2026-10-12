import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VendedoresService } from '../vendedores/vendedores.service';
import { CrearVisitaDto } from './dtos';
import { Visita, VisitaDocument } from './schemas/visitas.schema';

@Injectable()
export class VisitasService {
  constructor(
    @InjectModel(Visita.name)
    private readonly visitaModel: Model<VisitaDocument>,
    private readonly vendedoresService: VendedoresService,
  ) {}

  async crear(dto: CrearVisitaDto) {
    const vendedor = await this.vendedoresService.obtener(dto.vendedorId);

    if (!vendedor.activo) {
      throw new ConflictException(`El vendedor ${dto.vendedorId} está inactivo`);
    }

    const nuevaVisita = new this.visitaModel({
      ...dto,
      fecha: new Date(dto.fecha),
    });

    const guardada = await nuevaVisita.save();
    return guardada.toJSON();
  }
}