import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament, TournamentStatus } from './entities/tournament.entity';

@ApiTags('tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo torneo' })
  @ApiResponse({ status: 201, description: 'Torneo creado', type: Tournament })
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los torneos' })
  @ApiQuery({ name: 'status', required: false, enum: TournamentStatus })
  @ApiResponse({ status: 200, description: 'Lista de torneos', type: [Tournament] })
  findAll(@Query('status') status?: TournamentStatus) {
    return this.tournamentsService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un torneo por ID' })
  @ApiResponse({ status: 200, description: 'Torneo encontrado', type: Tournament })
  @ApiResponse({ status: 404, description: 'Torneo no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un torneo' })
  @ApiResponse({ status: 200, description: 'Torneo actualizado', type: Tournament })
  @ApiResponse({ status: 404, description: 'Torneo no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTournamentDto: UpdateTournamentDto) {
    return this.tournamentsService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar un torneo' })
  @ApiResponse({ status: 200, description: 'Torneo cancelado' })
  @ApiResponse({ status: 404, description: 'Torneo no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentsService.remove(id);
  }
}
