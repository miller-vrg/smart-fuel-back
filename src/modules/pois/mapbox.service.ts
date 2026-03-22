import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IGeocodingService, GasStationPOI } from './interfaces/geocoding-service.interface';

/**
 * MapboxService – Implementación de IGeocodingService usando la API de Mapbox.
 *
 * Si no hay API key configurada, retorna datos mock para desarrollo.
 */
@Injectable()
export class MapboxService implements IGeocodingService {
  private readonly logger = new Logger(MapboxService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('app.mapboxApiKey') ?? '';
  }

  async findNearbyGasStations(
    lat: number,
    lon: number,
    radiusKm: number,
  ): Promise<GasStationPOI[]> {
    if (!this.apiKey || this.apiKey.includes('REEMPLAZAR')) {
      this.logger.warn('Mapbox API key no configurada – usando datos mock');
      return this.getMockStations(lat, lon);
    }

    try {
      const url = `${this.baseUrl}/fuel station.json`;

      const response = await axios.get(url, {
        params: {
          access_token: this.apiKey,
          proximity: `${lon},${lat}`,
          limit: 10,
          types: 'poi',
          bbox: this.getBoundingBox(lat, lon, radiusKm),
        },
      });

      interface MapboxFeature {
        id: string;
        text: string;
        place_name: string;
        center: [number, number];
        properties?: { category?: string };
      }

      return response.data.features.map((feature: MapboxFeature) => ({
        id: feature.id,
        name: feature.text,
        brand: this.extractBrand(feature.properties?.category ?? ''),
        distanceKm: this.haversineKm(lat, lon, feature.center[1], feature.center[0]),
        latitude: feature.center[1],
        longitude: feature.center[0],
        address: feature.place_name,
      }));
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Error consultando Mapbox API', errMessage);
      return this.getMockStations(lat, lon);
    }
  }

  // ─── Helpers ─────────────────────────────────

  private getBoundingBox(lat: number, lon: number, radiusKm: number): string {
    const deg = radiusKm / 111;
    return `${lon - deg},${lat - deg},${lon + deg},${lat + deg}`;
  }

  private extractBrand(category: string): string {
    const brands = ['Terpel', 'Primax', 'EDS', 'Texaco', 'Petrobras', 'Mobil', 'BP'];
    return brands.find((b) => category.toLowerCase().includes(b.toLowerCase())) ?? 'Genérica';
  }

  /** Fórmula Haversine para distancia entre dos coordenadas (Km) */
  private haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  private getMockStations(lat: number, lon: number): GasStationPOI[] {
    return [
      { id: 'mock-1', name: 'Terpel Autopista Norte', brand: 'Terpel', distanceKm: 12.4, latitude: lat + 0.05, longitude: lon + 0.02, address: 'Autopista Norte Km 12' },
      { id: 'mock-2', name: 'Primax Centro Comercial', brand: 'Primax', distanceKm: 18.2, latitude: lat - 0.08, longitude: lon + 0.05, address: 'Cra 15 # 85-40' },
      { id: 'mock-3', name: 'EDS El Dorado', brand: 'EDS', distanceKm: 25.7, latitude: lat + 0.1, longitude: lon - 0.03, address: 'Av El Dorado # 68-32' },
      { id: 'mock-4', name: 'Terpel Usaquén', brand: 'Terpel', distanceKm: 31.1, latitude: lat + 0.15, longitude: lon + 0.08, address: 'Cra 7 # 127-45' },
      { id: 'mock-5', name: 'Texaco Kennedy', brand: 'Texaco', distanceKm: 42.3, latitude: lat - 0.2, longitude: lon - 0.1, address: 'Av Boyacá # 35-12' },
    ];
  }
}
