import { IGeocodingService, GasStationPOI } from './interfaces/geocoding-service.interface';
export declare class NominatimService implements IGeocodingService {
    private readonly logger;
    private readonly overpassUrl;
    findNearbyGasStations(lat: number, lon: number, radiusKm: number): Promise<GasStationPOI[]>;
    private buildAddress;
    private haversineKm;
    private toRad;
    private getMockStations;
}
