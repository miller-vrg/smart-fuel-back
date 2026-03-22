import { Injectable, Inject } from '@nestjs/common';
import { FuelLog } from '@core/entities/fuel-log.entity';
import { Vehicle } from '@core/entities/vehicle.entity';
import { CreateFuelLogDto } from './dto/create-fuel-log.dto';
import { RangeCalculationDto, ConsumptionSummaryDto } from './dto/fuel-consumption.dto';
import { IFuelLogRepository } from '../../core/interfaces/fuel-log.repository.interface';
import { IVehicleRepository } from '../../core/interfaces/vehicle.repository.interface';
import { VehicleNotFoundException } from '../../core/exceptions/vehicle-not-found.exception';

/**
 * FuelService – "The Brain" del sistema.
 *
 * Responsabilidades (SRP):
 *  1. Registrar tanqueos
 *  2. Calcular autonomía real con buffer de seguridad
 *  3. Calcular promedio de consumo e identificar tendencias
 *
 * Principio Open/Closed: la lógica de cálculo está encapsulada
 * en métodos privados puros, extensibles sin modificar el servicio.
 */
@Injectable()
export class FuelService {
  constructor(
    @Inject('IFuelLogRepository')
    private readonly fuelLogRepo: IFuelLogRepository,

    @Inject('IVehicleRepository')
    private readonly vehicleRepo: IVehicleRepository,
  ) {}

  // ─────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────

  async registerFuelLog(dto: CreateFuelLogDto): Promise<FuelLog> {
    const vehicle = await this.findVehicleOrFail(dto.vehicleId);

    const lastLog = await this.fuelLogRepo.findLastLogByVehicleId(dto.vehicleId);

    const kmSinceLastLog = this.calculateKmSinceLastLog(dto.odometer, lastLog?.odometer);
    const kmPerGallon = kmSinceLastLog && dto.gallonsAdded
      ? kmSinceLastLog / dto.gallonsAdded
      : undefined;

    const newLog = this.fuelLogRepo.create({
      ...dto,
      totalCost: dto.gallonsAdded * dto.pricePerGallon,
      kmSinceLastLog,
      kmPerGallon,
    });

    const saved = await this.fuelLogRepo.save(newLog);

    // Actualizar el nivel actual del vehículo
    await this.vehicleRepo.updateCurrentFuel(vehicle.id, dto.gallonsAdded);

    return saved;
  }

  async getHistory(vehicleId: string, limit = 20): Promise<FuelLog[]> {
    await this.findVehicleOrFail(vehicleId);
    return this.fuelLogRepo.findLogsByVehicleIdDesc(vehicleId, limit);
  }

  /**
   * Calcula la autonomía actual con la fórmula central:
   *   safeRangeKm = (fuelGallons × kmPerGallon) × (1 - safetyBuffer)
   */
  async calculateRange(vehicleId: string): Promise<RangeCalculationDto> {
    const vehicle = await this.findVehicleOrFail(vehicleId);
    const { avgKmPerGallon } = await this.getConsumptionSummary(vehicleId);

    const effectiveKmPerGallon = avgKmPerGallon || Number(vehicle.avgKmPerGallon);
    const grossRangeKm = Number(vehicle.currentFuelGallons) * effectiveKmPerGallon;
    const safetyBuffer = Number(vehicle.safetyBuffer);
    const safeRangeKm = grossRangeKm * (1 - safetyBuffer);
    const fuelLevelPercent = (Number(vehicle.currentFuelGallons) / Number(vehicle.fuelCapacityGallons)) * 100;

    return {
      vehicleId,
      currentFuelGallons: Number(vehicle.currentFuelGallons),
      kmPerGallon: effectiveKmPerGallon,
      grossRangeKm: parseFloat(grossRangeKm.toFixed(1)),
      safetyBufferPercent: safetyBuffer * 100,
      safeRangeKm: parseFloat(safeRangeKm.toFixed(1)),
      fuelLevelPercent: parseFloat(fuelLevelPercent.toFixed(1)),
      status: this.resolveRangeStatus(safeRangeKm),
    };
  }

  async getConsumptionSummary(vehicleId: string): Promise<ConsumptionSummaryDto> {
    const logs = await this.fuelLogRepo.findLogsByVehicleIdDesc(vehicleId, 10);

    const logsWithKm = logs.filter((l) => l.kmPerGallon !== null);
    const sampleCount = logsWithKm.length;

    if (sampleCount === 0) {
      const vehicle = await this.findVehicleOrFail(vehicleId);
      return {
        vehicleId,
        avgKmPerGallon: Number(vehicle.avgKmPerGallon),
        lastKmPerGallon: null,
        trend: 'STABLE',
        sampleCount: 0,
        hasAnomaly: false,
        deviationPercent: null,
      };
    }

    const avg = logsWithKm.reduce((sum, l) => sum + Number(l.kmPerGallon), 0) / sampleCount;
    const lastKmPerGallon = Number(logsWithKm[0].kmPerGallon);
    const deviation = Math.abs(lastKmPerGallon - avg) / avg;
    const hasAnomaly = deviation > 0.15;

    return {
      vehicleId,
      avgKmPerGallon: parseFloat(avg.toFixed(2)),
      lastKmPerGallon: parseFloat(lastKmPerGallon.toFixed(2)),
      trend: this.resolveTrend(lastKmPerGallon, avg),
      sampleCount,
      hasAnomaly,
      deviationPercent: hasAnomaly ? parseFloat((deviation * 100).toFixed(1)) : null,
    };
  }

  // ─────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────

  private async findVehicleOrFail(vehicleId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw new VehicleNotFoundException(vehicleId);
    return vehicle;
  }

  private calculateKmSinceLastLog(
    currentOdometer?: number,
    lastOdometer?: number,
  ): number | undefined {
    if (!currentOdometer || !lastOdometer) return undefined;
    const km = currentOdometer - lastOdometer;
    return km > 0 ? km : undefined;
  }

  private resolveRangeStatus(safeRangeKm: number): 'SAFE' | 'WARNING' | 'CRITICAL' {
    if (safeRangeKm > 100) return 'SAFE';
    if (safeRangeKm > 40) return 'WARNING';
    return 'CRITICAL';
  }

  private resolveTrend(last: number, avg: number): 'UP' | 'DOWN' | 'STABLE' {
    const diff = ((last - avg) / avg) * 100;
    if (diff > 3) return 'UP';
    if (diff < -3) return 'DOWN';
    return 'STABLE';
  }
}
