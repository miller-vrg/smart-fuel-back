import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { IGeocodingService, GasStationPOI } from './interfaces/geocoding-service.interface';

/**
 * Estructura de respuesta de Nominatim / Overpass API (OpenStreetMap).
 */
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  namedetails?: { name?: string };
  extratags?: { brand?: string; operator?: string };
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: {
    name?: string;
    brand?: string;
    operator?: string;
    'addr:street'?: string;
    'addr:city'?: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

/**
 * NominatimService – Implementación de IGeocodingService usando OpenStreetMap (OSM).
 *
 * Usa Overpass API para buscar estaciones de combustible (amenity=fuel)
 * dentro de un radio dado. Es 100% gratuita y no requiere API key.
 *
 * Fallback: datos mock si la API no está disponible.
 */
@Injectable()
export class NominatimService implements IGeocodingService {
  private readonly logger = new Logger(NominatimService.name);
  private readonly overpassUrl = 'https://overpass-api.de/api/interpreter';

  async findNearbyGasStations(
    lat: number,
    lon: number,
    radiusKm: number,
  ): Promise<GasStationPOI[]> {
    try {
      const radiusMeters = Math.round(radiusKm * 1000);

      // Overpass QL: buscar nodos y ways con amenity=fuel
      const query = `
        [out:json][timeout:10];
        (
          node["amenity"="fuel"](around:${radiusMeters},${lat},${lon});
          way["amenity"="fuel"](around:${radiusMeters},${lat},${lon});
        );
        out center body 10;
      `;

      const response = await axios.post<OverpassResponse>(
        this.overpassUrl,
        `data=${encodeURIComponent(query)}`,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 12000,
        },
      );

      const elements = response.data.elements;

      return elements
        .map((el): GasStationPOI | null => {
          const elLat = el.lat ?? el.center?.lat;
          const elLon = el.lon ?? el.center?.lon;
          if (!elLat || !elLon) return null;

          return {
            id: `osm-${el.type}-${el.id}`,
            name: el.tags?.name ?? 'Estación sin nombre',
            brand: el.tags?.brand ?? el.tags?.operator ?? 'Genérica',
            distanceKm: this.haversineKm(lat, lon, elLat, elLon),
            latitude: elLat,
            longitude: elLon,
            address: this.buildAddress(el),
          };
        })
        .filter((poi): poi is GasStationPOI => poi !== null)
        .sort((a, b) => a.distanceKm - b.distanceKm);

    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Error consultando Overpass API (OSM)', errMessage);
      return this.getMockStations(lat, lon);
    }
  }

  // ─── Helpers ─────────────────────────────────

  private buildAddress(el: OverpassElement): string {
    const street = el.tags?.['addr:street'] ?? '';
    const city = el.tags?.['addr:city'] ?? '';
    return [street, city].filter(Boolean).join(', ') || 'Dirección desconocida';
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
