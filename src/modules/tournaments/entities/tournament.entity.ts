export enum TournamentType {
  SINGLES = 'SINGLES',
  DOUBLES = 'DOUBLES',
  MIXED_DOUBLES = 'MIXED_DOUBLES',
}

export enum TournamentCategory {
  FUTURES = 'FUTURES',
  CHALLENGER = 'CHALLENGER',
  ATP_250 = 'ATP_250',
  ATP_500 = 'ATP_500',
  GRAND_SLAM = 'GRAND_SLAM',
}

export enum TournamentStatus {
  DRAFT = 'DRAFT',
  REGISTRATION_OPEN = 'REGISTRATION_OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class Tournament {
  id: number;
  name: string;
  type: TournamentType;
  category: TournamentCategory;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  maxParticipants: number;
  genderRestriction?: 'MALE' | 'FEMALE' | null;
  createdAt: Date;
  updatedAt: Date;
}
