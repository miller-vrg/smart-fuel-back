import { Injectable, Logger, Inject } from '@nestjs/common';
import { PreferencesService } from '@modules/preferences/preferences.service';
import {
  IGeocodingService,
  GasStationPOI,
  GEOCODING_SERVICE,
} from './interfaces/geocoding-service.interface';

export interface PrioritizedPOI extends GasStationPOI {
  preferenceRank: number | null;
  isRecommended: boolean;
}

/**
 * PoisService – Lógica de Decisión Crítica:
 *
 * 1. Busca estaciones dentro del rango de autonomía
 * 2. Filtra por Preferencia 1 del usuario
 * 3. Si ninguna alcanzable → degrada a Preferencia 2
 * 4. Si tampoco → retorna la más cercana sin importar marca
 * 5. Excluye marcas de la lista negra del usuario
 *
 * DIP: Depende de IGeocodingService (abstracción), no de MapboxService ni NominatimService.
 */
@Injectable()
export class PoisService {
  private readonly logger = new Logger(PoisService.name);

  constructor(
    @Inject(GEOCODING_SERVICE)
    private readonly geocodingService: IGeocodingService,
    private readonly preferencesService: PreferencesService,
  ) {}

  async findNearestByPreference(
    lat: number,
    lon: number,
    vehicleId: string,
    safeRangeKm: number,
  ): Promise<PrioritizedPOI[]> {
    const [allStations, orderedBrands, excludedBrands] = await Promise.all([
      this.geocodingService.findNearbyGasStations(lat, lon, safeRangeKm),
      this.preferencesService.getOrderedBrands(vehicleId),
      this.preferencesService.getExcludedBrands(vehicleId),
    ]);

    // Excluir marcas de la lista negra
    const available = allStations.filter(
      (s) => !excludedBrands.some((b) => b.toLowerCase() === s.brand.toLowerCase()),
    );

    // Asignar rango de preferencia a cada estación
    const ranked: PrioritizedPOI[] = available.map((station) => {
      const rankIndex = orderedBrands.findIndex(
        (b) => b.toLowerCase() === station.brand.toLowerCase(),
      );
      return {
        ...station,
        preferenceRank: rankIndex >= 0 ? rankIndex + 1 : null,
        isRecommended: false,
      };
    });

    // Intentar encontrar estaciones dentro del rango por prioridad (degradación)
    const recommended = this.resolveBestOption(ranked, safeRangeKm, orderedBrands);

    this.logger.log(
      `POIs: ${available.length} disponibles, rango seguro: ${safeRangeKm}km → recomendada: ${recommended?.name ?? 'ninguna'}`,
    );

    return ranked
      .map((s) => ({ ...s, isRecommended: s.id === recommended?.id }))
      .sort((a, b) => {
        // Primero recomendadas, luego por preferencia, luego por distancia
        if (a.isRecommended) return -1;
        if (b.isRecommended) return 1;
        if (a.preferenceRank !== null && b.preferenceRank !== null)
          return a.preferenceRank - b.preferenceRank;
        if (a.preferenceRank !== null) return -1;
        if (b.preferenceRank !== null) return 1;
        return a.distanceKm - b.distanceKm;
      });
  }

  /**
   * Degradación automática:
   * Pref1 en rango → Pref2 en rango → cualquier más cercana
   */
  private resolveBestOption(
    stations: PrioritizedPOI[],
    safeRangeKm: number,
    orderedBrands: string[],
  ): PrioritizedPOI | null {
    const inRange = stations.filter((s) => s.distanceKm <= safeRangeKm);

    // Intentar cada preferencia en orden
    for (let rank = 1; rank <= orderedBrands.length; rank++) {
      const match = inRange
        .filter((s) => s.preferenceRank === rank)
        .sort((a, b) => a.distanceKm - b.distanceKm)[0];
      if (match) return match;
    }

    // Fallback: la más cercana disponible sin importar marca
    return inRange.sort((a, b) => a.distanceKm - b.distanceKm)[0] ?? null;
  }
}
