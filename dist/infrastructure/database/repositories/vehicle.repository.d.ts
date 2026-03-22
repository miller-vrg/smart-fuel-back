import { Repository } from 'typeorm';
import { Vehicle } from '../../../core/entities/vehicle.entity';
import { IVehicleRepository } from '../../../core/interfaces/vehicle.repository.interface';
export declare class VehicleRepository implements IVehicleRepository {
    private readonly repository;
    constructor(repository: Repository<Vehicle>);
    findById(id: string): Promise<Vehicle | null>;
    updateCurrentFuel(id: string, currentFuelGallons: number): Promise<void>;
}
