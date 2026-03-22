import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface AnomalyResult {
  vehicleId: string;
  hasAnomaly: boolean;
  currentKmPerGallon: number;
  historicAvgKmPerGallon: number;
  deviationPercent: number;
  direction: 'HIGH_CONSUMPTION' | 'LOW_CONSUMPTION' | 'NORMAL';
  message: string;
}

/**
 * AnomalyDetectorService – SRP: única responsabilidad es detectar
 * desviaciones de consumo >15% y emitir eventos para el gateway WebSocket.
 *
 * Abierto para extensión: se puede agregar más algoritmos de detección
 * sin modificar esta clase (OCP).
 */
@Injectable()
export class AnomalyDetectorService {
  private readonly logger = new Logger(AnomalyDetectorService.name);
  private readonly threshold: number;

  constructor(private readonly configService: ConfigService) {
    this.threshold = this.configService.get<number>('app.anomalyThreshold') ?? 0.15;
  }

  /**
   * Compara consumo actual vs histórico.
   * Si desviación > threshold (default 15%) → retorna anomalía.
   */
  analyze(
    vehicleId: string,
    currentKmPerGallon: number,
    historicAvgKmPerGallon: number,
  ): AnomalyResult {
    if (historicAvgKmPerGallon <= 0) {
      return this.noAnomaly(vehicleId, currentKmPerGallon, historicAvgKmPerGallon);
    }

    const deviation = (currentKmPerGallon - historicAvgKmPerGallon) / historicAvgKmPerGallon;
    const absDeviation = Math.abs(deviation);
    const hasAnomaly = absDeviation > this.threshold;

    const direction =
      !hasAnomaly
        ? 'NORMAL'
        : deviation < 0
          ? 'HIGH_CONSUMPTION'
          : 'LOW_CONSUMPTION';

    const message = this.buildMessage(direction, absDeviation * 100, currentKmPerGallon);

    if (hasAnomaly) {
      this.logger.warn(
        `Anomalía detectada en vehículo ${vehicleId}: ${message} (${(absDeviation * 100).toFixed(1)}% desviación)`,
      );
    }

    return {
      vehicleId,
      hasAnomaly,
      currentKmPerGallon: parseFloat(currentKmPerGallon.toFixed(2)),
      historicAvgKmPerGallon: parseFloat(historicAvgKmPerGallon.toFixed(2)),
      deviationPercent: parseFloat((absDeviation * 100).toFixed(1)),
      direction,
      message,
    };
  }

  private buildMessage(
    direction: string,
    deviationPct: number,
    current: number,
  ): string {
    if (direction === 'NORMAL') return 'Consumo dentro del rango normal';
    if (direction === 'HIGH_CONSUMPTION') {
      return `⚠️ Consumo elevado: ${current.toFixed(1)} Km/L (${deviationPct.toFixed(0)}% mayor al promedio). Posible fallo mecánico o carga excesiva.`;
    }
    return `📈 Eficiencia mejorada: ${current.toFixed(1)} Km/L (${deviationPct.toFixed(0)}% mejor al promedio).`;
  }

  private noAnomaly(
    vehicleId: string,
    current: number,
    historic: number,
  ): AnomalyResult {
    return {
      vehicleId,
      hasAnomaly: false,
      currentKmPerGallon: current,
      historicAvgKmPerGallon: historic,
      deviationPercent: 0,
      direction: 'NORMAL',
      message: 'Sin historial suficiente para comparar',
    };
  }
}
