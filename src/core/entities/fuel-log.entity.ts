import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('fuel_logs')
export class FuelLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.fuelLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  /** Galones cargados en este tanqueo */
  @Column('decimal', { precision: 8, scale: 3 })
  gallonsAdded: number;

  /** Precio por galón en moneda local */
  @Column('decimal', { precision: 10, scale: 2 })
  pricePerGallon: number;

  /** Costo total = gallonsAdded × pricePerGallon */
  @Column('decimal', { precision: 12, scale: 2 })
  totalCost: number;

  /** Odómetro al momento del tanqueo */
  @Column('decimal', { precision: 10, scale: 1, nullable: true })
  odometer: number;

  /** Km recorridos desde el último tanqueo */
  @Column('decimal', { precision: 10, scale: 1, nullable: true })
  kmSinceLastLog: number;

  /** Consumo calculado para este tramo (Km/galón) */
  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  kmPerGallon: number;

  @Column({ length: 150, nullable: true })
  stationName: string;

  @Column({ length: 50, nullable: true })
  stationBrand: string;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ nullable: true, length: 255 })
  notes: string;

  @CreateDateColumn()
  loggedAt: Date;
}
