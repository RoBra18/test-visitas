import { Module } from '@nestjs/common';
import { VisitasController } from './visitas/visitas.controller';
import { VisitasService } from './visitas/visitas.service';
import { VisitasService } from './visitas.service';

@Module({
  controllers: [VisitasController],
  providers: [VisitasService]
})
export class VisitasModule {}
