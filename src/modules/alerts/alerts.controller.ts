import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { AlertsGateway } from './alerts.gateway';
import { GenericAlertData } from './interfaces/alert-payload.interface';
import { AnomalyResult } from '@modules/analytics/anomaly-detector.service';

export class TestNotificationDto {
  @ApiProperty({ description: 'UUID del vehículo', example: '2092f8d9-736b-4e93-9a86-4a3da455070e' })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ description: 'Tipo de notificación', example: 'smart_stop', enum: ['traffic_alert', 'smart_stop', 'anomaly_alert'] })
  @IsString()
  @IsIn(['traffic_alert', 'smart_stop', 'anomaly_alert'])
  type: 'traffic_alert' | 'smart_stop' | 'anomaly_alert';

  @ApiProperty({ description: 'Mensaje de la notificación', example: 'Primax Central is 2km away.' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'Título de la notificación', example: 'Smart Stop Suggestion' })
  @IsOptional()
  @IsString()
  title?: string;
}

@ApiTags('alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsGateway: AlertsGateway) {}

  @Post('test-notification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar una notificación de prueba a un vehículo conectado por WebSocket' })
  @ApiBody({
    schema: {
      example: {
        vehicleId: '2092f8d9-736b-4e93-9a86-4a3da455070e',
        type: 'smart_stop',
        title: 'Smart Stop Suggestion',
        message: 'Recommended Stop: Primax Central is 2km away.',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Notificación enviada' })
  sendTestNotification(@Body() dto: TestNotificationDto): { success: boolean; message: string; details: TestNotificationDto } {
    const alertData: GenericAlertData = {
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
        const anomaly: AnomalyResult = {
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
}
