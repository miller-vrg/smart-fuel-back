import { AnomalyResult } from '@modules/analytics/anomaly-detector.service';

// ─── Tipos de evento WebSocket ─────────────────────────────────
export type AlertEventType =
  | 'anomaly_alert'
  | 'low_range_alert'
  | 'traffic_alert'
  | 'speedcam_alert'
  | 'refuel_prompt'
  | 'smart_stop'
  | 'notification';

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';

// ─── Payload base que envía el Gateway ─────────────────────────
export interface AlertPayload<T = Record<string, unknown>> {
  type: AlertEventType;
  vehicleId: string;
  timestamp: string;
  severity: AlertSeverity;
  data: T;
}

// ─── Data específica por tipo de alerta ────────────────────────

/** Datos enviados en anomaly_alert */
export type AnomalyAlertData = AnomalyResult;

/** Datos enviados en low_range_alert */
export interface LowRangeAlertData {
  safeRangeKm: number;
  status: string;
  message: string;
}

/** Datos enviados en traffic_alert / smart_stop / notification */
export interface GenericAlertData {
  title?: string;
  message: string;
}

/** Datos enviados en speedcam_alert */
export interface SpeedCamAlertData {
  lat: number;
  lon: number;
  kmAhead: number;
}

/** Datos enviados en refuel_prompt */
export interface RefuelPromptData {
  stoppedMinutes: number;
  message: string;
}

// ─── Payloads tipados por evento ───────────────────────────────
export type AnomalyAlertPayload     = AlertPayload<AnomalyAlertData>;
export type LowRangeAlertPayload    = AlertPayload<LowRangeAlertData>;
export type TrafficAlertPayload     = AlertPayload<GenericAlertData>;
export type SmartStopPayload        = AlertPayload<GenericAlertData>;
export type SpeedCamAlertPayload    = AlertPayload<SpeedCamAlertData>;
export type RefuelPromptPayload     = AlertPayload<RefuelPromptData>;
