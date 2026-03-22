import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AnomalyResult } from '@modules/analytics/anomaly-detector.service';
import { GenericAlertData, SpeedCamAlertData } from './interfaces/alert-payload.interface';
export declare class AlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private vehicleClients;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribe(data: {
        vehicleId: string;
    }, client: Socket): {
        event: string;
        data: {
            vehicleId: string;
        };
    };
    sendAnomalyAlert(vehicleId: string, anomaly: AnomalyResult): void;
    sendLowRangeAlert(vehicleId: string, safeRangeKm: number, status: string): void;
    sendTrafficAlert(vehicleId: string, incident: GenericAlertData): void;
    sendSpeedCamAlert(vehicleId: string, location: SpeedCamAlertData): void;
    sendRefuelPrompt(vehicleId: string, stoppedMinutes: number): void;
    sendSmartStopSuggestion(vehicleId: string, suggestion: GenericAlertData): void;
}
