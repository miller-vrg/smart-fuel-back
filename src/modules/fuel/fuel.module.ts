import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelLog } from '@core/entities/fuel-log.entity';
import { Vehicle } from '@core/entities/vehicle.entity';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';
import { FuelLogRepository } from '../../infrastructure/database/repositories/fuel-log.repository';
import { VehicleRepository } from '../../infrastructure/database/repositories/vehicle.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FuelLog, Vehicle])],
  controllers: [FuelController],
  providers: [
    FuelService,
    { provide: 'IFuelLogRepository', useClass: FuelLogRepository },
    { provide: 'IVehicleRepository', useClass: VehicleRepository }
  ],
  exports: [FuelService],
})
export class FuelModule {}
