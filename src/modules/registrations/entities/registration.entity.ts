export enum RegistrationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  WITHDRAWN = 'WITHDRAWN',
}

export class Registration {
  id: number;
  tournamentId: number;
  playerId: number;
  status: RegistrationStatus;
  registeredAt: Date;
  updatedAt: Date;
}
