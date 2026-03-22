import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnomalyDetectorService } from './anomaly-detector.service';
import { FuelModule } from '@modules/fuel/fuel.module';
import { AlertsModule } from '@modules/alerts/alerts.module';

@Module({
  imports: [FuelModule, AlertsModule],
  providers: [AnalyticsService, AnomalyDetectorService],
  exports: [AnalyticsService, AnomalyDetectorService],
})
export class AnalyticsModule {}
