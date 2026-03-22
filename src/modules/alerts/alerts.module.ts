import { Module } from '@nestjs/common';
import { AlertsGateway } from './alerts.gateway';
import { AlertsController } from './alerts.controller';

@Module({
  controllers: [AlertsController],
  providers: [AlertsGateway],
  exports: [AlertsGateway],
})
export class AlertsModule {}
