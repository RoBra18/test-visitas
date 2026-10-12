import { CrearVisitaDto, DetalleVentaDto } from "../dtos";
import { TipoVisita } from "../schemas/visitas.schema";

export const EJEMPLO_VENTA : CrearVisitaDto = {
  vendedorId: 'V001',
  clienteId: 'CLI-100',
  tipo: TipoVisita.VENTA,
  fecha: '2026-10-01T14:30:00.000Z',
  ubicacion: { lat: -17.7833, lng: -63.1821 },
  notas: 'Cliente interesado en renovar equipos',
  detalle : {
    productosOfrecidos: [
      { sku: 'LAP-001', interes: 'ALTO' },
      { sku: 'MON-002', interes: 'BAJO' },
    ],
    pedidoGenerado: false,
  },
};

export const EJEMPLO_COBRANZA : CrearVisitaDto = {
  vendedorId: 'V001',
  clienteId: 'CLI-101',
  tipo: TipoVisita.COBRANZA,
  fecha: '2026-10-01T15:00:00.000Z',
  ubicacion: { lat: -17.7833, lng: -63.1821 },
  notas: 'Cobro de factura pendiente',
  detalle: {
    montoCobrado: 1500,
    moneda: 'BOB',
    comprobante: 'REC-2026-001',
  },
};

export const EJEMPLO_RECLAMO : CrearVisitaDto= {
  vendedorId: 'V001',
  clienteId: 'CLI-102',
  tipo: TipoVisita.RECLAMO,
  fecha: '2026-10-01T16:00:00.000Z',
  ubicacion: { lat: -17.7833, lng: -63.1821 },
  notas: 'Reclamo por entrega incompleta',
  detalle: {
    motivo: 'Caja llegó con precinto abierto y faltaban accesorios',
    prioridad: 'ALTA',
  },
};




export const SWAGGER_BODY_EXAMPLES = {
  venta: {
    summary: '1. Visita de Venta',
    description: 'Ejemplo con detalle de productos ofrecidos y pedido generado',
    value: EJEMPLO_VENTA,
  },
  cobranza: {
    summary: '2. Visita de Cobranza',
    description: 'Ejemplo con monto cobrado, moneda (BOB/USD) y comprobante',
    value: EJEMPLO_COBRANZA,
  },
  reclamo: {
    summary: '3. Visita de Reclamo',
    description: 'Ejemplo con motivo y prioridad (ALTA/MEDIA/BAJA)',
    value: EJEMPLO_RECLAMO,
  },
};

export const SWAGGER_RESPONSE_EXAMPLES = {
  venta: {
    summary: '1. Visita de Venta',
    value: {
      id: '6accc9ec46a427545973f069',
      ...EJEMPLO_VENTA,
      creadaEn: '2026-10-12T11:52:12.873Z',
    },
  },
  cobranza: {
    summary: '2. Visita de Cobranza',
    value: {
      id: '6accc9ec46a427545973f070',
      ...EJEMPLO_COBRANZA,
      creadaEn: '2026-10-12T11:52:12.873Z',
    },
  },
  reclamo: {
    summary: '3. Visita de Reclamo',
    value: {
      id: '6accc9ec46a427545973f071',
      ...EJEMPLO_RECLAMO,
      creadaEn: '2026-10-12T11:52:12.873Z',
    },
  },
};