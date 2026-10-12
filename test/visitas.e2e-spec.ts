import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('VisitasController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const basePayload = {
    vendedorId: 'V001',
    clienteId: 'CLI-100',
    fecha: '2026-10-01T14:30:00.000Z',
    ubicacion: { lat: -17.7833, lng: -63.1821 },
  };

  it('POST /visitas - debe responder 400 si el detalle no corresponde al tipo', () => {
    return request(app.getHttpServer())
      .post('/visitas')
      .send({
        ...basePayload,
        tipo: 'COBRANZA',
        detalle: {
          productosOfrecidos: [{ sku: 'LAP-001', interes: 'ALTO' }],
          pedidoGenerado: false,
        },
      })
      .expect(400);
  });

  it('POST /visitas - debe responder 201 si el detalle es válido para VENTA', () => {
    return request(app.getHttpServer())
      .post('/visitas')
      .send({
        ...basePayload,
        tipo: 'VENTA',
        detalle: {
          productosOfrecidos: [{ sku: 'LAP-001', interes: 'ALTO' }],
          pedidoGenerado: false,
        },
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('creadaEn');
      });
  });
});