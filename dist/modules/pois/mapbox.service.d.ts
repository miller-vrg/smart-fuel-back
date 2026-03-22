import { ConfigService } from '@nestjs/config';
import { IGeocodingService, GasStationPOI } from './interfaces/geocoding-service.interface';
export declare class MapboxService implements IGeocodingService {
    private readonly configService;
    private readonly logger;
    private readonly apiKey;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    findNearbyGasStations(lat: number, lon: number, radiusKm: number): Promise<GasStationPOI[]>;
    private getBoundingBox;
    private extractBrand;
    private haversineKm;
    private toRad;
    private getMockStations;
}
