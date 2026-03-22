import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FuelService } from './fuel.service';
import { CreateFuelLogDto } from './dto/create-fuel-log.dto';
import { FuelLog } from '../../core/entities/fuel-log.entity';

@ApiTags('fuel')
@Controller('fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Post('log')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo tanqueo' })
  @ApiResponse({ status: 201, description: 'Tanqueo registrado exitosamente', type: FuelLog })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  registerFuelLog(@Body() dto: CreateFuelLogDto) {
    return this.fuelService.registerFuelLog(dto);
  }

  @Get('history/:vehicleId')
  @ApiOperation({ summary: 'Historial de tanqueos por vehículo' })
  @ApiParam({ name: 'vehicleId', description: 'UUID del vehículo' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'N° de registros (default: 20)' })
  @ApiResponse({ status: 200, description: 'Lista de registros de tanqueos.', type: [FuelLog] })
  getHistory(
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Query('limit') limit?: number,
  ) {
    return this.fuelService.getHistory(vehicleId, limit);
  }

  @Get('range/:vehicleId')
  @ApiOperation({ summary: 'Calcular autonomía actual con buffer de seguridad' })
  @ApiParam({ name: 'vehicleId', description: 'UUID del vehículo' })
  @ApiResponse({
    status: 200,
    description: 'Retorna safeRangeKm, fuelLevelPercent y status (SAFE|WARNING|CRITICAL)',
  })
  calculateRange(@Param('vehicleId', ParseUUIDPipe) vehicleId: string) {
    return this.fuelService.calculateRange(vehicleId);
  }

  @Get('consumption/:vehicleId')
  @ApiOperation({ summary: 'Resumen de consumo y detección de anomalías' })
  @ApiParam({ name: 'vehicleId', description: 'UUID del vehículo' })
  @ApiResponse({ status: 200, description: 'Resumen de consumo promedio y rendimiento.' })
  getConsumptionSummary(@Param('vehicleId', ParseUUIDPipe) vehicleId: string) {
    return this.fuelService.getConsumptionSummary(vehicleId);
  }
}
