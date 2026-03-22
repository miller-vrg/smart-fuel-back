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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsController = exports.TestNotificationDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const alerts_gateway_1 = require("./alerts.gateway");
class TestNotificationDto {
}
exports.TestNotificationDto = TestNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID del vehículo', example: '2092f8d9-736b-4e93-9a86-4a3da455070e' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TestNotificationDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tipo de notificación', example: 'smart_stop', enum: ['traffic_alert', 'smart_stop', 'anomaly_alert'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['traffic_alert', 'smart_stop', 'anomaly_alert']),
    __metadata("design:type", String)
], TestNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mensaje de la notificación', example: 'Primax Central is 2km away.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TestNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Título de la notificación', example: 'Smart Stop Suggestion' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestNotificationDto.prototype, "title", void 0);
let AlertsController = class AlertsController {
    constructor(alertsGateway) {
        this.alertsGateway = alertsGateway;
    }
    sendTestNotification(dto) {
        const alertData = {
            title: dto.title,
            message: dto.message,
        };
        switch (dto.type) {
            case 'traffic_alert':
                this.alertsGateway.sendTrafficAlert(dto.vehicleId, alertData);
                break;
            case 'smart_stop':
                this.alertsGateway.sendSmartStopSuggestion(dto.vehicleId, alertData);
                break;
            case 'anomaly_alert': {
                const anomaly = {
                    vehicleId: dto.vehicleId,
                    hasAnomaly: true,
                    currentKmPerGallon: 25.4,
                    historicAvgKmPerGallon: 30.2,
                    deviationPercent: 18,
                    direction: 'HIGH_CONSUMPTION',
                    message: dto.message || 'Anomaly detected. Fuel cost exceeded usual average by 18%.',
                };
                this.alertsGateway.sendAnomalyAlert(dto.vehicleId, anomaly);
                break;
            }
        }
        return { success: true, message: 'WebSocket notification broadcasted', details: dto };
    }
};
exports.AlertsController = AlertsController;
__decorate([
    (0, common_1.Post)('test-notification'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar una notificación de prueba a un vehículo conectado por WebSocket' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                vehicleId: '2092f8d9-736b-4e93-9a86-4a3da455070e',
                type: 'smart_stop',
                title: 'Smart Stop Suggestion',
                message: 'Recommended Stop: Primax Central is 2km away.',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificación enviada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TestNotificationDto]),
    __metadata("design:returntype", Object)
], AlertsController.prototype, "sendTestNotification", null);
exports.AlertsController = AlertsController = __decorate([
    (0, swagger_1.ApiTags)('alerts'),
    (0, common_1.Controller)('alerts'),
    __metadata("design:paramtypes", [alerts_gateway_1.AlertsGateway])
], AlertsController);
//# sourceMappingURL=alerts.controller.js.map