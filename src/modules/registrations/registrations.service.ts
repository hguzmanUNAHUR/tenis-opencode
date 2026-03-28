import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Registration, RegistrationStatus } from './entities/registration.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { TournamentStatus } from '../tournaments/entities/tournament.entity';
import { PlayerStatus } from '../players/entities/player.entity';

const DB_PATH = path.join(process.cwd(), 'src/db/db.json');

interface DbData {
  players: any[];
  tournaments: any[];
  registrations: Registration[];
  nextPlayerId: number;
  nextTournamentId: number;
  nextRegistrationId: number;
}

function readDb(): DbData {
  if (!fs.existsSync(DB_PATH)) {
    return { players: [], tournaments: [], registrations: [], nextPlayerId: 1, nextTournamentId: 1, nextRegistrationId: 1 };
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  const parsed = JSON.parse(data);
  return {
    players: parsed.players || [],
    tournaments: parsed.tournaments || [],
    registrations: parsed.registrations || [],
    nextPlayerId: parsed.nextPlayerId || 1,
    nextTournamentId: parsed.nextTournamentId || 1,
    nextRegistrationId: parsed.nextRegistrationId || 1,
  };
}

function writeDb(data: DbData): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

@Injectable()
export class RegistrationsService {
  findByTournament(tournamentId: number): Registration[] {
    const db = readDb();
    return db.registrations.filter(
      (r) => r.tournamentId === tournamentId && r.status === RegistrationStatus.CONFIRMED,
    );
  }

  findOne(tournamentId: number, playerId: number): Registration {
    const db = readDb();
    const registration = db.registrations.find(
      (r) => r.tournamentId === tournamentId && r.playerId === playerId,
    );

    if (!registration) {
      throw new NotFoundException(`Registration not found`);
    }

    return registration;
  }

  create(tournamentId: number, createRegistrationDto: CreateRegistrationDto): Registration {
    const db = readDb();
    const { playerId } = createRegistrationDto;

    const tournament = db.tournaments.find((t) => t.id === tournamentId);
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${tournamentId} not found`);
    }

    if (tournament.status !== TournamentStatus.REGISTRATION_OPEN) {
      throw new BadRequestException('Tournament registration is not open');
    }

    const player = db.players.find((p) => p.id === playerId);
    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    if (player.status !== PlayerStatus.ACTIVE) {
      throw new BadRequestException('Player is not active');
    }

    if (tournament.genderRestriction && player.gender !== tournament.genderRestriction) {
      throw new BadRequestException('Player gender does not match tournament restriction');
    }

    const existingRegistration = db.registrations.find(
      (r) => r.tournamentId === tournamentId && r.playerId === playerId && r.status === RegistrationStatus.CONFIRMED,
    );
    if (existingRegistration) {
      throw new BadRequestException('Player already registered in this tournament');
    }

    const confirmedCount = db.registrations.filter(
      (r) => r.tournamentId === tournamentId && r.status === RegistrationStatus.CONFIRMED,
    ).length;
    if (confirmedCount >= tournament.maxParticipants) {
      throw new BadRequestException('Tournament is full');
    }

    const now = new Date();
    const newRegistration: Registration = {
      id: db.nextRegistrationId,
      tournamentId,
      playerId,
      status: RegistrationStatus.CONFIRMED,
      registeredAt: now,
      updatedAt: now,
    };

    db.registrations.push(newRegistration);
    db.nextRegistrationId++;
    writeDb(db);

    return newRegistration;
  }

  remove(tournamentId: number, playerId: number): Registration {
    const db = readDb();
    const index = db.registrations.findIndex(
      (r) => r.tournamentId === tournamentId && r.playerId === playerId && r.status !== RegistrationStatus.CANCELLED,
    );

    if (index === -1) {
      throw new NotFoundException(`Registration not found`);
    }

    db.registrations[index].status = RegistrationStatus.CANCELLED;
    db.registrations[index].updatedAt = new Date();
    writeDb(db);

    return db.registrations[index];
  }
}
