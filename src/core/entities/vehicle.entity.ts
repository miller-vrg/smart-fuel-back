import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { FuelLog } from './fuel-log.entity';
import { StopPreference } from './stop-preference.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  licensePlate: string;

  @Column({ length: 50 })
  brand: string;

  @Column({ length: 50 })
  model: string;

  @Column({ nullable: true, length: 10 })
  year: string;

  /** Capacidad total del tanque en galones */
  @Column('decimal', { precision: 10, scale: 4 })
  fuelCapacityGallons: number;

  /** Rendimiento promedio configurado por usuario (Km/galón) */
  @Column('decimal', { precision: 10, scale: 4 })
  avgKmPerGallon: number;

  /** Nivel de combustible actual en galones (actualizado por el app) */
  @Column('decimal', { precision: 10, scale: 4, default: 0 })
  currentFuelGallons: number;

  /** Buffer de seguridad personalizado (0.10 - 0.25) */
  @Column('decimal', { precision: 4, scale: 2, default: 0.15 })
  safetyBuffer: number;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.vehicles, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => FuelLog, (log) => log.vehicle)
  fuelLogs: FuelLog[];

  @OneToMany(() => StopPreference, (pref) => pref.vehicle)
  stopPreferences: StopPreference[];

  /** Notificar buscar gasolina X km antes de acabar autonomía */
  @Column('int', { default: 20 })
  notifyGasStationKmBefore: number;

  /** Notificar buscar descanso cada X horas (opcional) */
  @Column('int', { nullable: true })
  notifyRestStopHours: number;

  /** Límite de velocidad máximo permitido por usuario */
  @Column('int', { default: 100 })
  maxSpeedLimit: number;

  @Column('jsonb', { nullable: true })
  activeTrip: any;

  /** Marcado como vehículo preferido/principal */
  @Column({ default: false })
  isMain: boolean;

  /** Unidad de medida preferida (liters/gallons) */
  @Column({ length: 15, default: 'liters' })
  unit: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
