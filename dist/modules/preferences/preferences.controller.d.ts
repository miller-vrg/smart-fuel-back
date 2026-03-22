import { PreferencesService } from './preferences.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
export declare class PreferencesController {
    private readonly preferencesService;
    constructor(preferencesService: PreferencesService);
    getByVehicle(vehicleId: string): Promise<UpdatePreferencesDto>;
    updatePreferences(dto: UpdatePreferencesDto): Promise<UpdatePreferencesDto>;
}
