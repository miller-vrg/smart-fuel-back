import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AnomalyResult } from '@modules/analytics/anomaly-detector.service';
import {
  AlertPayload,
  GenericAlertData,
  SpeedCamAlertData,
  LowRangeAlertData,
  RefuelPromptData,
  AnomalyAlertPayload,
  LowRangeAlertPayload,
  TrafficAlertPayload,
  SmartStopPayload,
  SpeedCamAlertPayload,
  RefuelPromptPayload,
} from './interfaces/alert-payload.interface';

/**
 * AlertsGateway – WebSocket Gateway para alertas en tiempo real.
 *
 * Eventos emitidos al cliente:
 *  - anomaly_alert   → desviación de consumo >15%
 *  - low_range_alert → autonomía crítica (<40 Km)
 *  - traffic_alert   → alerta de tráfico en ruta
 *  - speedcam_alert  → fotomulta detectada
 *  - refuel_prompt   → ¿Tanqueaste? (10 min detenido)
 *  - smart_stop      → sugerencia de parada inteligente
 */
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200', 'http://localhost:8100'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/alerts',
})
export class AlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AlertsGateway.name);

  // Mapa vehicleId → socket IDs para routing directo
  private vehicleClients = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    this.vehicleClients.forEach((sockets) => {
      sockets.delete(client.id);
    });
  }

  /** El cliente debe suscribirse enviando su vehicleId */
  @SubscribeMessage('subscribe_vehicle')
  handleSubscribe(
    @MessageBody() data: { vehicleId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { vehicleId } = data;
    if (!this.vehicleClients.has(vehicleId)) {
      this.vehicleClients.set(vehicleId, new Set());
    }
    this.vehicleClients.get(vehicleId)!.add(client.id);
    client.join(`vehicle:${vehicleId}`);
    this.logger.log(`Socket ${client.id} suscrito al vehículo ${vehicleId}`);
    return { event: 'subscribed', data: { vehicleId } };
  }

  // ─── Métodos de emisión (llamados por los servicios) ─────────────

  sendAnomalyAlert(vehicleId: string, anomaly: AnomalyResult): void {
    const payload: AnomalyAlertPayload = {
      type: 'anomaly_alert',
      vehicleId,
      timestamp: new Date().toISOString(),
      severity: anomaly.direction === 'HIGH_CONSUMPTION' ? 'warning' : 'info',
      data: anomaly,
    };
    this.server.to(`vehicle:${vehicleId}`).emit('anomaly_alert', payload);
  }

  sendLowRangeAlert(vehicleId: string, safeRangeKm: number, status: string): void {
    const payload: LowRangeAlertPayload = {
      type: 'low_range_alert',
      vehicleId,
      timestamp: new Date().toISOString(),
      severity: status === 'CRITICAL' ? 'critical' : 'warning',
      data: { safeRangeKm, status, message: `Autonomía: ${safeRangeKm} Km – Busca una estación pronto.` },
    };
    this.server.to(`vehicle:${vehicleId}`).emit('low_range_alert', payload);
  }

  sendTrafficAlert(vehicleId: string, incident: GenericAlertData): void {
    const payload: TrafficAlertPayload = {
      type: 'traffic_alert',
      vehicleId,
      timestamp: new Date().toISOString(),
      severity: 'info',
      data: incident,
    };
    this.server.to(`vehicle:${vehicleId}`).emit('traffic_alert', payload);
  }

  sendSpeedCamAlert(vehicleId: string, location: SpeedCamAlertData): void {
    const payload: SpeedCamAlertPayload = {
      type: 'speedcam_alert',
      vehicleId,
      timestamp: new Date().toISOString(),
      severity: 'warning',
      data: location,
    };
    this.server.to(`vehicle:${vehicleId}`).emit('speedcam_alert', payload);
  }

  sendRefuelPrompt(vehicleId: string, stoppedMinutes: number): void {
    const data: RefuelPromptData = { stoppedMinutes, message: '¿Estás en una estación? ¿Tanqueaste?' };
    const payload: RefuelPromptPayload = {
      type: 'refuel_prompt',
      vehicleId,
      timestamp: new Date().toISOString(),
      severity: 'info',
      data,
    };
    this.server.to(`vehicle:${vehicleId}`).emit('refuel_prompt', payload);
  }

  sendSmartStopSuggestion(vehicleId: string, suggestion: GenericAlertData): void {
    const payload: SmartStopPayload = {
      type: 'smart_stop',
      vehicleId,
      timestamp: new Date().toISOString(),
      severity: 'success',
      data: suggestion,
    };
    this.server.to(`vehicle:${vehicleId}`).emit('smart_stop', payload);
  }
}
