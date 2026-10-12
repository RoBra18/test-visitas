import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Visita, VisitaSchema } from '../visitas/schemas/visitas.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Visita.name, schema: VisitaSchema }]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
