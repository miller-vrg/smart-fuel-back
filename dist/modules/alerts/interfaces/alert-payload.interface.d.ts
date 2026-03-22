import { AnomalyResult } from '@modules/analytics/anomaly-detector.service';
export type AlertEventType = 'anomaly_alert' | 'low_range_alert' | 'traffic_alert' | 'speedcam_alert' | 'refuel_prompt' | 'smart_stop' | 'notification';
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';
export interface AlertPayload<T = Record<string, unknown>> {
    type: AlertEventType;
    vehicleId: string;
    timestamp: string;
    severity: AlertSeverity;
    data: T;
}
export type AnomalyAlertData = AnomalyResult;
export interface LowRangeAlertData {
    safeRangeKm: number;
    status: string;
    message: string;
}
export interface GenericAlertData {
    title?: string;
    message: string;
}
export interface SpeedCamAlertData {
    lat: number;
    lon: number;
    kmAhead: number;
}
export interface RefuelPromptData {
    stoppedMinutes: number;
    message: string;
}
export type AnomalyAlertPayload = AlertPayload<AnomalyAlertData>;
export type LowRangeAlertPayload = AlertPayload<LowRangeAlertData>;
export type TrafficAlertPayload = AlertPayload<GenericAlertData>;
export type SmartStopPayload = AlertPayload<GenericAlertData>;
export type SpeedCamAlertPayload = AlertPayload<SpeedCamAlertData>;
export type RefuelPromptPayload = AlertPayload<RefuelPromptData>;
