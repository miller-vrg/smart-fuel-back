"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AlertsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let AlertsGateway = AlertsGateway_1 = class AlertsGateway {
    constructor() {
        this.logger = new common_1.Logger(AlertsGateway_1.name);
        this.vehicleClients = new Map();
    }
    handleConnection(client) {
        this.logger.log(`Cliente conectado: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Cliente desconectado: ${client.id}`);
        this.vehicleClients.forEach((sockets) => {
            sockets.delete(client.id);
        });
    }
    handleSubscribe(data, client) {
        const { vehicleId } = data;
        if (!this.vehicleClients.has(vehicleId)) {
            this.vehicleClients.set(vehicleId, new Set());
        }
        this.vehicleClients.get(vehicleId).add(client.id);
        client.join(`vehicle:${vehicleId}`);
        this.logger.log(`Socket ${client.id} suscrito al vehículo ${vehicleId}`);
        return { event: 'subscribed', data: { vehicleId } };
    }
    sendAnomalyAlert(vehicleId, anomaly) {
        const payload = {
            type: 'anomaly_alert',
            vehicleId,
            timestamp: new Date().toISOString(),
            severity: anomaly.direction === 'HIGH_CONSUMPTION' ? 'warning' : 'info',
            data: anomaly,
        };
        this.server.to(`vehicle:${vehicleId}`).emit('anomaly_alert', payload);
    }
    sendLowRangeAlert(vehicleId, safeRangeKm, status) {
        const payload = {
            type: 'low_range_alert',
            vehicleId,
            timestamp: new Date().toISOString(),
            severity: status === 'CRITICAL' ? 'critical' : 'warning',
            data: { safeRangeKm, status, message: `Autonomía: ${safeRangeKm} Km – Busca una estación pronto.` },
        };
        this.server.to(`vehicle:${vehicleId}`).emit('low_range_alert', payload);
    }
    sendTrafficAlert(vehicleId, incident) {
        const payload = {
            type: 'traffic_alert',
            vehicleId,
            timestamp: new Date().toISOString(),
            severity: 'info',
            data: incident,
        };
        this.server.to(`vehicle:${vehicleId}`).emit('traffic_alert', payload);
    }
    sendSpeedCamAlert(vehicleId, location) {
        const payload = {
            type: 'speedcam_alert',
            vehicleId,
            timestamp: new Date().toISOString(),
            severity: 'warning',
            data: location,
        };
        this.server.to(`vehicle:${vehicleId}`).emit('speedcam_alert', payload);
    }
    sendRefuelPrompt(vehicleId, stoppedMinutes) {
        const data = { stoppedMinutes, message: '¿Estás en una estación? ¿Tanqueaste?' };
        const payload = {
            type: 'refuel_prompt',
            vehicleId,
            timestamp: new Date().toISOString(),
            severity: 'info',
            data,
        };
        this.server.to(`vehicle:${vehicleId}`).emit('refuel_prompt', payload);
    }
    sendSmartStopSuggestion(vehicleId, suggestion) {
        const payload = {
            type: 'smart_stop',
            vehicleId,
            timestamp: new Date().toISOString(),
            severity: 'success',
            data: suggestion,
        };
        this.server.to(`vehicle:${vehicleId}`).emit('smart_stop', payload);
    }
};
exports.AlertsGateway = AlertsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AlertsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe_vehicle'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AlertsGateway.prototype, "handleSubscribe", null);
exports.AlertsGateway = AlertsGateway = AlertsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:4200', 'http://localhost:8100'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
        namespace: '/alerts',
    })
], AlertsGateway);
//# sourceMappingURL=alerts.gateway.js.map