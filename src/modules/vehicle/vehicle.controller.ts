import {
  Controller, Get, Post, Delete, Param, Body,
  HttpCode, HttpStatus, ParseUUIDPipe, Patch, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Vehicle } from '../../core/entities/vehicle.entity';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo vehículo' })
  @ApiResponse({ status: 201, description: 'El vehículo ha sido creado exitosamente.', type: Vehicle })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  create(@Body() dto: CreateVehicleDto) {
    return this.vehicleService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los vehículos' })
  @ApiResponse({ status: 200, description: 'Lista de vehículos obtenida.', type: [Vehicle] })
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'UUID del vehículo' })
  @ApiOperation({ summary: 'Obtener un vehículo por su ID' })
  @ApiResponse({ status: 200, description: 'Vehículo encontrado.', type: Vehicle })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehicleService.findOne(id);
  }

  @Patch(':id/fuel-level')
  @ApiOperation({ summary: 'Actualizar nivel de combustible en galones' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo' })
  @ApiQuery({ name: 'gallons', type: Number, description: 'Nivel actual de gasolina en galones' })
  @ApiResponse({ status: 200, description: 'Nivel de combustible actualizado exitosamente.' })
  updateFuelLevel(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('gallons') gallons: number,
  ) {
    return this.vehicleService.updateFuelLevel(id, gallons);
  }

  @Patch(':id/safety-buffer')
  @ApiOperation({ summary: 'Actualizar buffer de seguridad (0.10 - 0.25)' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo' })
  @ApiQuery({ name: 'buffer', type: Number, description: 'Nuevo buffer de seguridad' })
  @ApiResponse({ status: 200, description: 'Buffer de seguridad actualizado.' })
  updateSafetyBuffer(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('buffer') buffer: number,
  ) {
    return this.vehicleService.updateSafetyBuffer(id, buffer);
  }

  @Patch(':id/active-trip')
  @ApiOperation({ summary: 'Guardar el estado de la ruta activa' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo' })
  @ApiResponse({ status: 200, description: 'Ruta guardada.' })
  updateActiveTrip(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: any,
  ) {
    return this.vehicleService.updateActiveTrip(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un vehículo' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo a eliminar' })
  @ApiResponse({ status: 204, description: 'Vehículo eliminado con éxito.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehicleService.remove(id);
  }
}
