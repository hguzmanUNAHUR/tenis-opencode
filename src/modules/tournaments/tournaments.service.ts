import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Tournament, TournamentStatus } from './entities/tournament.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

const DB_PATH = path.join(process.cwd(), 'src/db/db.json');

interface DbData {
  players: any[];
  tournaments: Tournament[];
  nextPlayerId: number;
  nextTournamentId: number;
}

function readDb(): DbData {
  if (!fs.existsSync(DB_PATH)) {
    return { players: [], tournaments: [], nextPlayerId: 1, nextTournamentId: 1 };
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  const parsed = JSON.parse(data);
  return {
    players: parsed.players || [],
    tournaments: parsed.tournaments || [],
    nextPlayerId: parsed.nextPlayerId || 1,
    nextTournamentId: parsed.nextTournamentId || 1,
  };
}

function writeDb(data: DbData): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

@Injectable()
export class TournamentsService {
  findAll(status?: TournamentStatus): Tournament[] {
    const db = readDb();
    const tournaments = db.tournaments || [];
    
    if (status) {
      return tournaments.filter((t) => t.status === status);
    }
    
    return tournaments.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  findOne(id: number): Tournament {
    const db = readDb();
    const tournament = db.tournaments.find((t) => t.id === id);

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return tournament;
  }

  create(createTournamentDto: CreateTournamentDto): Tournament {
    const db = readDb();

    const now = new Date();
    const newTournament: Tournament = {
      id: db.nextTournamentId,
      ...createTournamentDto,
      status: TournamentStatus.DRAFT,
      genderRestriction: createTournamentDto.genderRestriction || null,
      createdAt: now,
      updatedAt: now,
    };

    db.tournaments.push(newTournament);
    db.nextTournamentId++;
    writeDb(db);

    return newTournament;
  }

  update(id: number, updateTournamentDto: UpdateTournamentDto): Tournament {
    const db = readDb();
    const index = db.tournaments.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    const updatedTournament: Tournament = {
      ...db.tournaments[index],
      ...updateTournamentDto,
      updatedAt: new Date(),
    };

    db.tournaments[index] = updatedTournament;
    writeDb(db);

    return updatedTournament;
  }

  remove(id: number): Tournament {
    const db = readDb();
    const index = db.tournaments.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    db.tournaments[index].status = TournamentStatus.CANCELLED;
    db.tournaments[index].updatedAt = new Date();
    writeDb(db);

    return db.tournaments[index];
  }
}
