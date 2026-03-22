import { Repository } from 'typeorm';
import { FuelLog } from '../../../core/entities/fuel-log.entity';
import { IFuelLogRepository } from '../../../core/interfaces/fuel-log.repository.interface';
export declare class FuelLogRepository implements IFuelLogRepository {
    private readonly repository;
    constructor(repository: Repository<FuelLog>);
    create(fuelLog: Partial<FuelLog>): FuelLog;
    save(fuelLog: FuelLog): Promise<FuelLog>;
    findLogsByVehicleIdDesc(vehicleId: string, take?: number): Promise<FuelLog[]>;
    findLastLogByVehicleId(vehicleId: string): Promise<FuelLog | null>;
}
