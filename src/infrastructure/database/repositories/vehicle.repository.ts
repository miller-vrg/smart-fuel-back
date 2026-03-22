import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../../../core/entities/vehicle.entity';
import { IVehicleRepository } from '../../../core/interfaces/vehicle.repository.interface';

@Injectable()
export class VehicleRepository implements IVehicleRepository {
  constructor(
    @InjectRepository(Vehicle)
    private readonly repository: Repository<Vehicle>,
  ) {}

  async findById(id: string): Promise<Vehicle | null> {
    return this.repository.findOne({ where: { id } });
  }

  async updateCurrentFuel(id: string, currentFuelGallons: number): Promise<void> {
    await this.repository.update(id, { currentFuelGallons });
  }
}
