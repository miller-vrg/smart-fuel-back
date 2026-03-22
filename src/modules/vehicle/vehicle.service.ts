import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '@core/entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

/** Responsabilidad única: CRUD de vehículos y actualización de nivel de combustible */
@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    const existing = await this.vehicleRepo.findOne({ where: { licensePlate: dto.licensePlate } });
    if (existing) {
      throw new ConflictException(`Ya existe un vehículo con placa ${dto.licensePlate}`);
    }
    const vehicle = this.vehicleRepo.create({
      ...dto,
      currentFuelGallons: dto.currentFuelGallons ?? 0,
      safetyBuffer: dto.safetyBuffer ?? 0.15,
    });
    return this.vehicleRepo.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({ where: { id } });
    if (!vehicle) throw new NotFoundException(`Vehículo ${id} no encontrado`);
    return vehicle;
  }

  async updateFuelLevel(vehicleId: string, gallons: number): Promise<Vehicle> {
    const vehicle = await this.findOne(vehicleId);
    vehicle.currentFuelGallons = gallons;
    return this.vehicleRepo.save(vehicle);
  }

  async updateSafetyBuffer(vehicleId: string, buffer: number): Promise<Vehicle> {
    const vehicle = await this.findOne(vehicleId);
    vehicle.safetyBuffer = buffer;
    return this.vehicleRepo.save(vehicle);
  }

  async updateActiveTrip(vehicleId: string, activeTrip: any): Promise<Vehicle> {
    const vehicle = await this.findOne(vehicleId);
    vehicle.activeTrip = activeTrip;
    return this.vehicleRepo.save(vehicle);
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepo.remove(vehicle);
  }
}
