import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visita, VisitaDocument } from 'src/visitas/schemas/visitas.schema';
import { ReporteVisitasPorDiaQueryDto } from './dtos/reporte-visitas-por-dia-query.dto';
import { ReporteDiaRespuestaDto } from './dtos/reporte-dia-respuesta.dto';
import { fechaBoliviaFinUtc, fechaBoliviaInicioUtc } from 'src/common/utils/fecha-bolivia.util';

@Injectable()
export class ReportesService {
    constructor(
        @InjectModel(Visita.name)
        private readonly visitaModel: Model<VisitaDocument>,
    ) { }

    async obtenerVisitasPorDia(
        filtros: ReporteVisitasPorDiaQueryDto,
    ): Promise<ReporteDiaRespuestaDto[]> {
        const { vendedorId, desde, hasta } = filtros;

        const fechaInicioUtc = fechaBoliviaInicioUtc(desde);
        const fechaFinUtc = fechaBoliviaFinUtc(hasta);

        if (fechaInicioUtc > fechaFinUtc) {
            throw new BadRequestException('El parámetro "desde" no puede ser posterior a "hasta"');
        }

        return this.visitaModel.aggregate<ReporteDiaRespuestaDto>([
            {
                $match: {
                    vendedorId,
                    fecha: {
                        $gte: fechaInicioUtc,
                        $lte: fechaFinUtc,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$fecha',
                            timezone: '-04:00',
                        },
                    },
                    total: { $sum: 1 },
                    ventas: {
                        $sum: { $cond: [{ $eq: ['$tipo', 'VENTA'] }, 1, 0] },
                    },
                    cobranzas: {
                        $sum: { $cond: [{ $eq: ['$tipo', 'COBRANZA'] }, 1, 0] },
                    },
                    reclamos: {
                        $sum: { $cond: [{ $eq: ['$tipo', 'RECLAMO'] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    fecha: '$_id',
                    total: 1,
                    porTipo: {
                        VENTA: '$ventas',
                        COBRANZA: '$cobranzas',
                        RECLAMO: '$reclamos',
                    },
                },
            },
            {
                $sort: { fecha: 1 },
            },
        ]);
    }
}