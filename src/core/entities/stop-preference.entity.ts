import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('stop_preferences')
export class StopPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.stopPreferences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  /** Nombre de la marca (Terpel, Primax, EDS, etc.) */
  @Column({ length: 80 })
  brandName: string;

  /**
   * Prioridad de parada: 1 = primera opción, 2 = segunda, etc.
   * Null = marca excluida
   */
  @Column({ type: 'int', nullable: true })
  priority: number | null;

  /** Solo buscar esta marca en autopistas */
  @Column({ default: false })
  onlyHighway: boolean;

  /** Marca excluida (nunca mostrar) */
  @Column({ default: false })
  isExcluded: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
