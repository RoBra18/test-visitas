import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './health/health.module';
import { VendedoresModule } from './vendedores/vendedores.module';
import { VisitasModule } from './visitas/visitas.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI', 'mongodb://localhost:27017/examen_visitas'),
      }),
    }),
    HealthModule,
    VendedoresModule,
    VisitasModule,
    ReportesModule,
  ],
})
export class AppModule {}
