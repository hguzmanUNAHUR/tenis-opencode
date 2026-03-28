import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { Player, PlayerStatus } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

const DB_PATH = path.join(__dirname, '../../db/db.json');

interface DbData {
  players: Player[];
}

function readDb(): DbData {
  if (!fs.existsSync(DB_PATH)) {
    return { players: [] };
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeDb(data: DbData): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

@Injectable()
export class PlayersService {
  /**
   * Lista todos los jugadores activos ordenados por ranking (mayor points primero).
   */
  findAll(): Player[] {
    const db = readDb();
    return db.players
      .filter((p) => p.status === PlayerStatus.ACTIVE)
      .sort((a, b) => b.rankingPoints - a.rankingPoints);
  }

  /**
   * Obtiene un jugador por su ID.
   * @throws NotFoundException si no existe
   */
  findOne(id: string): Player {
    const db = readDb();
    const player = db.players.find((p) => p.id === id);

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return player;
  }

  /**
   * Crea un nuevo jugador.
   * @throws BadRequestException si el email ya existe
   */
  create(createPlayerDto: CreatePlayerDto): Player {
    const db = readDb();

    if (db.players.some((p) => p.email === createPlayerDto.email)) {
      throw new BadRequestException('Email already exists');
    }

    const now = new Date();
    const newPlayer: Player = {
      id: randomUUID(),
      ...createPlayerDto,
      status: PlayerStatus.ACTIVE,
      rankingPoints: 0,
      createdAt: now,
      updatedAt: now,
    };

    db.players.push(newPlayer);
    writeDb(db);

    return newPlayer;
  }

  /**
   * Actualiza datos de un jugador.
   * @throws NotFoundException si no existe
   * @throws BadRequestException si el nuevo email ya existe
   */
  update(id: string, updatePlayerDto: UpdatePlayerDto): Player {
    const db = readDb();
    const index = db.players.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    if (
      updatePlayerDto.email &&
      updatePlayerDto.email !== db.players[index].email &&
      db.players.some((p) => p.email === updatePlayerDto.email)
    ) {
      throw new BadRequestException('Email already exists');
    }

    const updatedPlayer: Player = {
      ...db.players[index],
      ...updatePlayerDto,
      updatedAt: new Date(),
    };

    db.players[index] = updatedPlayer;
    writeDb(db);

    return updatedPlayer;
  }

  /**
   * Elimina (desactiva) un jugador.
   * Es un delete lógico, cambia status a INACTIVE.
   * @throws NotFoundException si no existe
   */
  remove(id: string): Player {
    const db = readDb();
    const index = db.players.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    db.players[index].status = PlayerStatus.INACTIVE;
    db.players[index].updatedAt = new Date();
    writeDb(db);

    return db.players[index];
  }
}
