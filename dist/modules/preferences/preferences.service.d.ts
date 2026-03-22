import { Repository } from 'typeorm';
import { StopPreference } from '@core/entities/stop-preference.entity';
import { Vehicle } from '@core/entities/vehicle.entity';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
export declare class PreferencesService {
    private readonly prefRepo;
    private readonly vehicleRepo;
    constructor(prefRepo: Repository<StopPreference>, vehicleRepo: Repository<Vehicle>);
    getByVehicle(vehicleId: string): Promise<UpdatePreferencesDto>;
    updatePreferences(dto: UpdatePreferencesDto): Promise<UpdatePreferencesDto>;
    getOrderedBrands(vehicleId: string): Promise<string[]>;
    getExcludedBrands(vehicleId: string): Promise<string[]>;
}
