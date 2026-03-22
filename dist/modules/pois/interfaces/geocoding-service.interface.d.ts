export interface GasStationPOI {
    id: string;
    name: string;
    brand: string;
    distanceKm: number;
    latitude: number;
    longitude: number;
    address: string;
}
export interface IGeocodingService {
    findNearbyGasStations(lat: number, lon: number, radiusKm: number): Promise<GasStationPOI[]>;
}
export declare const GEOCODING_SERVICE: unique symbol;
