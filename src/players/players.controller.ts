import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { Player, CreatePlayerDto, UpdatePlayerDto } from './players.model';

const DB_PATH = path.join(__dirname, '../db/db.json');

function readDb(): { players: Player[] } {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeDb(data: { players: Player[] }): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export const getAllPlayers = (req: Request, res: Response): void => {
  const db = readDb();
  const sortedPlayers = db.players.sort((a, b) => b.rankingPoints - a.rankingPoints);
  res.json(sortedPlayers);
};

export const getPlayerById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = readDb();
  const player = db.players.find(p => p.id === id);

  if (!player) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }

  res.json(player);
};

export const createPlayer = (req: Request, res: Response): void => {
  const dto: CreatePlayerDto = req.body;

  if (!dto.firstName || !dto.lastName || !dto.email || !dto.dateOfBirth || !dto.gender || !dto.nationality) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const db = readDb();

  if (db.players.some(p => p.email === dto.email)) {
    res.status(400).json({ error: 'Email already exists' });
    return;
  }

  const now = new Date().toISOString();
  const newPlayer: Player = {
    id: randomUUID(),
    ...dto,
    status: 'ACTIVE',
    rankingPoints: 0,
    createdAt: now,
    updatedAt: now,
  };

  db.players.push(newPlayer);
  writeDb(db);

  res.status(201).json(newPlayer);
};

export const updatePlayer = (req: Request, res: Response): void => {
  const { id } = req.params;
  const dto: UpdatePlayerDto = req.body;
  const db = readDb();
  const index = db.players.findIndex(p => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }

  if (dto.email && dto.email !== db.players[index].email && db.players.some(p => p.email === dto.email)) {
    res.status(400).json({ error: 'Email already exists' });
    return;
  }

  const updatedPlayer: Player = {
    ...db.players[index],
    ...dto,
    updatedAt: new Date().toISOString(),
  };

  db.players[index] = updatedPlayer;
  writeDb(db);

  res.json(updatedPlayer);
};

export const deletePlayer = (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = readDb();
  const index = db.players.findIndex(p => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }

  db.players[index].status = 'INACTIVE';
  db.players[index].updatedAt = new Date().toISOString();
  writeDb(db);

  res.json({ message: 'Player deactivated', player: db.players[index] });
};
