import { NotFoundException } from '@nestjs/common';

export class VehicleNotFoundException extends NotFoundException {
  constructor(vehicleId: string) {
    super(`Vehículo con ID ${vehicleId} no encontrado`);
  }
}
