/** Respuesta del cálculo de autonomía para el dashboard */
export class RangeCalculationDto {
  vehicleId: string;
  /** Galones actuales en el tanque */
  currentFuelGallons: number;
  /** Km/galón promedio histórico del vehículo */
  kmPerGallon: number;
  /** Autonomía bruta sin buffer (Km) */
  grossRangeKm: number;
  /** Porcentaje del buffer de seguridad aplicado */
  safetyBufferPercent: number;
  /** Autonomía real disponible = grossRangeKm × (1 - safetyBuffer) */
  safeRangeKm: number;
  /** Porcentaje del tanque restante (0-100) */
  fuelLevelPercent: number;
  /** Estado: 'SAFE' | 'WARNING' | 'CRITICAL' */
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

/** Respuesta del consumo promedio */
export class ConsumptionSummaryDto {
  vehicleId: string;
  /** Km/galón promedio de los últimos tanqueos */
  avgKmPerGallon: number;
  /** Km/galón del último tanqueo */
  lastKmPerGallon: number | null;
  /** Tendencia respecto al histórico: 'UP' | 'DOWN' | 'STABLE' */
  trend: 'UP' | 'DOWN' | 'STABLE';
  /** Número de tanqueos analizados */
  sampleCount: number;
  /** ¿Hay desviación anómala? */
  hasAnomaly: boolean;
  /** Porcentaje de desviación si existe */
  deviationPercent: number | null;
}
