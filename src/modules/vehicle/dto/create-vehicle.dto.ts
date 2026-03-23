import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, Min, Max, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC-123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  licensePlate: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  brand: string;

  @ApiProperty({ example: 'Hilux' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  model: string;

  @ApiPropertyOptional({ example: '2022' })
  @IsOptional()
  @IsString()
  year?: string;

  @ApiProperty({ description: 'Capacidad total del tanque en galones', example: 15 })
  @IsNumber()
  @IsPositive()
  fuelCapacityGallons: number;

  @ApiProperty({ description: 'Rendimiento configurado por usuario (Km/galón)', example: 10 })
  @IsNumber()
  @IsPositive()
  avgKmPerGallon: number;

  @ApiPropertyOptional({ description: 'Buffer de seguridad 0.10-0.25', example: 0.15 })
  @IsOptional()
  @IsNumber()
  @Min(0.10)
  @Max(0.25)
  safetyBuffer?: number;

  @ApiPropertyOptional({ description: 'Galones actuales en el tanque', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentFuelGallons?: number;

  @ApiPropertyOptional({ description: 'UUID del usuario propietario' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Marcar como vehículo principal', example: false })
  @IsOptional()
  @IsBoolean()
  isMain?: boolean;

  @ApiPropertyOptional({ description: 'Unidad de medida preferida (liters/gallons)', example: 'liters' })
  @IsOptional()
  @IsString()
  unit?: string;
}
