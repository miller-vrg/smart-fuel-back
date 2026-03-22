import { PreferencesService } from '@modules/preferences/preferences.service';
import { IGeocodingService, GasStationPOI } from './interfaces/geocoding-service.interface';
export interface PrioritizedPOI extends GasStationPOI {
    preferenceRank: number | null;
    isRecommended: boolean;
}
export declare class PoisService {
    private readonly geocodingService;
    private readonly preferencesService;
    private readonly logger;
    constructor(geocodingService: IGeocodingService, preferencesService: PreferencesService);
    findNearestByPreference(lat: number, lon: number, vehicleId: string, safeRangeKm: number): Promise<PrioritizedPOI[]>;
    private resolveBestOption;
}
