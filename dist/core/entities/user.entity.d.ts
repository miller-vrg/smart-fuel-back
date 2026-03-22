import { Vehicle } from './vehicle.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    vehicles: Vehicle[];
    createdAt: Date;
    updatedAt: Date;
}
