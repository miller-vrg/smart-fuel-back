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

  async create(dto: CreateVehicleDto, userId?: string): Promise<Vehicle> {
    const existing = await this.vehicleRepo.findOne({ where: { licensePlate: dto.licensePlate } });
    if (existing) {
      throw new ConflictException(`Ya existe un vehículo con placa ${dto.licensePlate}`);
    }

    if (dto.isMain) {
      await this.vehicleRepo.update({ userId, isMain: true }, { isMain: false });
    }

    const vehicle = this.vehicleRepo.create({
      ...dto,
      userId,
      currentFuelGallons: dto.currentFuelGallons ?? 0,
      safetyBuffer: dto.safetyBuffer ?? 0.15,
      isMain: dto.isMain ?? (await this.vehicleRepo.count({ where: { userId } })) === 0, 
    });
    return this.vehicleRepo.save(vehicle);
  }

  async findAll(userId?: string): Promise<Vehicle[]> {
    return this.vehicleRepo.find({ 
      where: userId ? { userId } : {},
      order: { createdAt: 'DESC' } 
    });
  }

  async findOne(id: string, userId?: string): Promise<Vehicle> {
    const where: any = { id };
    if (userId) where.userId = userId;
    
    const vehicle = await this.vehicleRepo.findOne({ where });
    if (!vehicle) throw new NotFoundException(`Vehículo ${id} no encontrado`);
    return vehicle;
  }

  async update(id: string, dto: Partial<Vehicle>, userId?: string): Promise<Vehicle> {
    const vehicle = await this.findOne(id, userId);
    
    // Safety check for license plate conflicts
    if (dto.licensePlate && dto.licensePlate !== vehicle.licensePlate) {
      const existing = await this.vehicleRepo.findOne({ where: { licensePlate: dto.licensePlate } });
      if (existing) {
        throw new ConflictException(`Ya existe un vehículo con placa ${dto.licensePlate}`);
      }
    }

    // Handle isMain logic if changed
    if (dto.isMain === true && !vehicle.isMain) {
      await this.vehicleRepo.update({ userId, isMain: true }, { isMain: false });
    }

    Object.assign(vehicle, dto);
    return this.vehicleRepo.save(vehicle);
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
