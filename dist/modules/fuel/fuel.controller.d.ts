import { FuelService } from './fuel.service';
import { CreateFuelLogDto } from './dto/create-fuel-log.dto';
import { FuelLog } from '../../core/entities/fuel-log.entity';
export declare class FuelController {
    private readonly fuelService;
    constructor(fuelService: FuelService);
    registerFuelLog(dto: CreateFuelLogDto): Promise<FuelLog>;
    getHistory(vehicleId: string, limit?: number): Promise<FuelLog[]>;
    calculateRange(vehicleId: string): Promise<import("./dto/fuel-consumption.dto").RangeCalculationDto>;
    getConsumptionSummary(vehicleId: string): Promise<import("./dto/fuel-consumption.dto").ConsumptionSummaryDto>;
}
