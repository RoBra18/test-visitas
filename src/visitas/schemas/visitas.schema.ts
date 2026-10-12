import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type VisitaDocument = HydratedDocument<Visita>;

export enum TipoVisita {
  VENTA = 'VENTA',
  COBRANZA = 'COBRANZA',
  RECLAMO = 'RECLAMO',
}

@Schema({ _id: false })
export class Ubicacion {
  @Prop({ required: true, type: Number })
  lat!: number;

  @Prop({ required: true, type: Number })
  lng!: number;
}

@Schema({
  collection: 'visitas',
  timestamps: { createdAt: 'creadaEn', updatedAt: false },
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Visita {
  @Prop({ required: true, type: String })
  vendedorId!: string;

  @Prop({ required: true, type: String })
  clienteId!: string;

  @Prop({ required: true, enum: TipoVisita, type: String })
  tipo!: TipoVisita;

  @Prop({ required: true, type: Date })
  fecha!: Date;

  @Prop({ required: true, type: Ubicacion })
  ubicacion!: Ubicacion;

  @Prop({ required: false, type: String })
  notas?: string;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  detalle!: Record<string, any>;
  
  @Prop({ required: true, type: Date })
  creadaEn!: Date;
}

export const VisitaSchema = SchemaFactory.createForClass(Visita);

VisitaSchema.index({ vendedorId: 1, tipo: 1, fecha: -1 });
VisitaSchema.index({ vendedorId: 1, fecha: -1 });
VisitaSchema.index({ fecha: -1 });
