import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Vehicle } from '../../core/entities/vehicle.entity';
export declare class VehicleController {
    private readonly vehicleService;
    constructor(vehicleService: VehicleService);
    create(dto: CreateVehicleDto): Promise<Vehicle>;
    findAll(): Promise<Vehicle[]>;
    findOne(id: string): Promise<Vehicle>;
    updateFuelLevel(id: string, gallons: number): Promise<Vehicle>;
    updateSafetyBuffer(id: string, buffer: number): Promise<Vehicle>;
    updateActiveTrip(id: string, body: any): Promise<Vehicle>;
    remove(id: string): Promise<void>;
}
