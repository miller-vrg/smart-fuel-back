import { FuelLog } from '@core/entities/fuel-log.entity';
import { CreateFuelLogDto } from './dto/create-fuel-log.dto';
import { RangeCalculationDto, ConsumptionSummaryDto } from './dto/fuel-consumption.dto';
import { IFuelLogRepository } from '../../core/interfaces/fuel-log.repository.interface';
import { IVehicleRepository } from '../../core/interfaces/vehicle.repository.interface';
export declare class FuelService {
    private readonly fuelLogRepo;
    private readonly vehicleRepo;
    constructor(fuelLogRepo: IFuelLogRepository, vehicleRepo: IVehicleRepository);
    registerFuelLog(dto: CreateFuelLogDto): Promise<FuelLog>;
    getHistory(vehicleId: string, limit?: number): Promise<FuelLog[]>;
    calculateRange(vehicleId: string): Promise<RangeCalculationDto>;
    getConsumptionSummary(vehicleId: string): Promise<ConsumptionSummaryDto>;
    private findVehicleOrFail;
    private calculateKmSinceLastLog;
    private resolveRangeStatus;
    private resolveTrend;
}
