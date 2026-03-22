import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsLatitude,
  IsLongitude,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFuelLogDto {
  @ApiProperty({ description: 'ID del vehículo', example: 'uuid-del-vehiculo' })
  @IsString()
  vehicleId: string;

  @ApiProperty({ description: 'Galones cargados en este tanqueo', example: 10.5 })
  @IsNumber()
  @IsPositive()
  gallonsAdded: number;

  @ApiProperty({ description: 'Precio por galón en moneda local', example: 15000 })
  @IsNumber()
  @IsPositive()
  pricePerGallon: number;

  @ApiPropertyOptional({ description: 'Lectura del odómetro actual', example: 85430 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  odometer?: number;

  @ApiPropertyOptional({ description: 'Nombre de la estación', example: 'Terpel Autopista Norte' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  stationName?: string;

  @ApiPropertyOptional({ description: 'Marca de la estación', example: 'Terpel' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  stationBrand?: string;

  @ApiPropertyOptional({ description: 'Latitud de la estación', example: 4.710989 })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitud de la estación', example: -74.072092 })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
}
