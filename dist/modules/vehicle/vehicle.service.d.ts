import { Repository } from 'typeorm';
import { Vehicle } from '@core/entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
export declare class VehicleService {
    private readonly vehicleRepo;
    constructor(vehicleRepo: Repository<Vehicle>);
    create(dto: CreateVehicleDto): Promise<Vehicle>;
    findAll(): Promise<Vehicle[]>;
    findOne(id: string): Promise<Vehicle>;
    updateFuelLevel(vehicleId: string, gallons: number): Promise<Vehicle>;
    updateSafetyBuffer(vehicleId: string, buffer: number): Promise<Vehicle>;
    updateActiveTrip(vehicleId: string, activeTrip: any): Promise<Vehicle>;
    remove(id: string): Promise<void>;
}
