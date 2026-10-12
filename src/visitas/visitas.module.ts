import { Module } from '@nestjs/common';
import { VisitasController } from './visitas/visitas.controller';
import { VisitasService } from './visitas/visitas.service';
import { VisitasService } from './visitas.service';
import { VisitasController } from './visitas.controller';

@Module({
  controllers: [VisitasController],
  providers: [VisitasService]
})
export class VisitasModule {}
