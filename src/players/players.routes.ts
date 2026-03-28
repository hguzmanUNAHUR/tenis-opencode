import { Router } from 'express';
import * as PlayersController from './players.controller';

const router = Router();

router.get('/players', PlayersController.getAllPlayers);
router.get('/players/:id', PlayersController.getPlayerById);
router.post('/players', PlayersController.createPlayer);
router.put('/players/:id', PlayersController.updatePlayer);
router.delete('/players/:id', PlayersController.deletePlayer);

export default router;
