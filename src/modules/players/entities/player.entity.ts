export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum PlayerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export class Player {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  status: PlayerStatus;
  rankingPoints: number;
  createdAt: Date;
  updatedAt: Date;
}
