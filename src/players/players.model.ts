export type Gender = 'MALE' | 'FEMALE';

export type PlayerStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  status: PlayerStatus;
  rankingPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlayerDto {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
}

export interface UpdatePlayerDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  status?: PlayerStatus;
  rankingPoints?: number;
}
