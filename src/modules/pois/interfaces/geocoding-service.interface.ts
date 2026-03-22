/**
 * GasStationPOI – Representa un punto de interés (estación de combustible)
 * normalizado independientemente del proveedor de geocodificación.
 */
export interface GasStationPOI {
  id: string;
  name: string;
  brand: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  address: string;
}

/**
 * IGeocodingService – Abstracción para cualquier proveedor de búsqueda
 * de estaciones de combustible cercanas (Mapbox, Nominatim, Google, etc.)
 *
 * Principio: Dependency Inversion (DIP) – PoisService depende de esta
 * interfaz, no de una implementación concreta.
 */
export interface IGeocodingService {
  /**
   * Busca estaciones de combustible dentro de un radio dado.
   * @param lat  Latitud del punto de origen
   * @param lon  Longitud del punto de origen
   * @param radiusKm  Radio de búsqueda en kilómetros
   * @returns Lista de estaciones normalizadas como GasStationPOI
   */
  findNearbyGasStations(
    lat: number,
    lon: number,
    radiusKm: number,
  ): Promise<GasStationPOI[]>;
}

/**
 * Token de inyección para NestJS DI.
 * Úsalo en @Inject(GEOCODING_SERVICE) en vez de inyectar una clase concreta.
 */
export const GEOCODING_SERVICE = Symbol('IGeocodingService');
