import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo jugador' })
  @ApiResponse({ status: 201, description: 'Jugador creado', type: Player })
  @ApiResponse({ status: 400, description: 'Email ya existe' })
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los jugadores activos (ordenados por ranking)' })
  @ApiResponse({ status: 200, description: 'Lista de jugadores', type: [Player] })
  findAll() {
    return this.playersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un jugador por ID' })
  @ApiResponse({ status: 200, description: 'Jugador encontrado', type: Player })
  @ApiResponse({ status: 404, description: 'Jugador no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un jugador' })
  @ApiResponse({ status: 200, description: 'Jugador actualizado', type: Player })
  @ApiResponse({ status: 404, description: 'Jugador no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (desactivar) un jugador' })
  @ApiResponse({ status: 200, description: 'Jugador desactivado' })
  @ApiResponse({ status: 404, description: 'Jugador no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.remove(id);
  }
}
