import { AlertsGateway } from './alerts.gateway';
export declare class TestNotificationDto {
    vehicleId: string;
    type: 'traffic_alert' | 'smart_stop' | 'anomaly_alert';
    message: string;
    title?: string;
}
export declare class AlertsController {
    private readonly alertsGateway;
    constructor(alertsGateway: AlertsGateway);
    sendTestNotification(dto: TestNotificationDto): {
        success: boolean;
        message: string;
        details: TestNotificationDto;
    };
}
