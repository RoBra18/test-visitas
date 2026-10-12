import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CrearVisitaDto } from './crear-visita.dto';
import { TipoVisita } from '../schemas/visitas.schema';

describe('CrearVisitaDto - Validación Polimórfica de Detalle', () => {
  const basePayload = {
    vendedorId: 'V001',
    clienteId: 'CLI-100',
    fecha: '2026-10-01T14:30:00.000Z',
    ubicacion: { lat: -17.7833, lng: -63.1821 },
  };

  it('debe ser VÁLIDO cuando tipo es VENTA y el detalle corresponde a VENTA', async () => {
    const payload = {
      ...basePayload,
      tipo: TipoVisita.VENTA,
      detalle: {
        productosOfrecidos: [{ sku: 'LAP-001', interes: 'ALTO' }],
        pedidoGenerado: false,
      },
    };

    const dto = plainToInstance(CrearVisitaDto, payload);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('debe FALLAR cuando tipo es COBRANZA pero se envía detalle de VENTA', async () => {
    const payload = {
      ...basePayload,
      tipo: TipoVisita.COBRANZA,
      detalle: {
        productosOfrecidos: [{ sku: 'LAP-001', interes: 'ALTO' }],
        pedidoGenerado: false,
      },
    };

    const dto = plainToInstance(CrearVisitaDto, payload);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const errorDetalle = errors.find((e) => e.property === 'detalle');
    expect(errorDetalle).toBeDefined();
  });

  it('debe ser VÁLIDO cuando tipo es COBRANZA y el detalle es correcto', async () => {
    const payload = {
      ...basePayload,
      tipo: TipoVisita.COBRANZA,
      detalle: {
        montoCobrado: 1500,
        moneda: 'BOB',
        comprobante: 'REC-2026-001',
      },
    };

    const dto = plainToInstance(CrearVisitaDto, payload);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('debe FALLAR cuando tipo es RECLAMO y faltan campos obligatorios en detalle', async () => {
    const payload = {
      ...basePayload,
      tipo: TipoVisita.RECLAMO,
      detalle: {
        motivo: 'Producto llegó roto',
      },
    };

    const dto = plainToInstance(CrearVisitaDto, payload);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const errorDetalle = errors.find((e) => e.property === 'detalle');
    expect(errorDetalle).toBeDefined();
  });
});