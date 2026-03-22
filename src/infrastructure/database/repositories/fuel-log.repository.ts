import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuelLog } from '../../../core/entities/fuel-log.entity';
import { IFuelLogRepository } from '../../../core/interfaces/fuel-log.repository.interface';

@Injectable()
export class FuelLogRepository implements IFuelLogRepository {
  constructor(
    @InjectRepository(FuelLog)
    private readonly repository: Repository<FuelLog>,
  ) {}

  create(fuelLog: Partial<FuelLog>): FuelLog {
    return this.repository.create(fuelLog);
  }

  async save(fuelLog: FuelLog): Promise<FuelLog> {
    return this.repository.save(fuelLog);
  }

  async findLogsByVehicleIdDesc(vehicleId: string, take?: number): Promise<FuelLog[]> {
    return this.repository.find({
      where: { vehicleId },
      order: { loggedAt: 'DESC' },
      take,
    });
  }

  async findLastLogByVehicleId(vehicleId: string): Promise<FuelLog | null> {
    return this.repository.findOne({
      where: { vehicleId },
      order: { loggedAt: 'DESC' },
    });
  }
}
