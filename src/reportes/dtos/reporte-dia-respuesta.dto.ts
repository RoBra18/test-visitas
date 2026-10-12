import { ApiProperty } from '@nestjs/swagger';

export class PorTipoDto {
    @ApiProperty({ example: 2 })
    VENTA!: number;

    @ApiProperty({ example: 1 })
    COBRANZA!: number;

    @ApiProperty({ example: 0 })
    RECLAMO!: number;
}

export class ReporteDiaRespuestaDto {
    @ApiProperty({ example: '2026-10-01' })
    fecha!: string;

    @ApiProperty({ example: 3 })
    total!: number;

    @ApiProperty({ type: PorTipoDto })
    porTipo!: PorTipoDto;
}