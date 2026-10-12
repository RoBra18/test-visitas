import { Module } from '@nestjs/common';
import { VisitasController } from './visitas.controller';
import { VisitasService } from './visitas.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VendedoresModule } from 'src/vendedores/vendedores.module';
import { Visita, VisitaSchema } from './schemas/visitas.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Visita.name, schema: VisitaSchema }]),
    VendedoresModule,
  ],
  controllers: [VisitasController],
  providers: [VisitasService]
})
export class VisitasModule {}
