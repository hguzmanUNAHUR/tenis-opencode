import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { Registration } from './entities/registration.entity';

@ApiTags('registrations')
@Controller('tournaments/:tournamentId')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Get('registrations')
  @ApiOperation({ summary: 'Listar inscripciones de un torneo' })
  @ApiResponse({ status: 200, description: 'Lista de inscripciones', type: [Registration] })
  findAll(@Param('tournamentId', ParseIntPipe) tournamentId: number) {
    return this.registrationsService.findByTournament(tournamentId);
  }

  @Post('registers')
  @ApiOperation({ summary: 'Inscribir un jugador en un torneo' })
  @ApiResponse({ status: 201, description: 'Inscripción creada', type: Registration })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  @ApiResponse({ status: 404, description: 'Torneo o jugador no encontrado' })
  create(
    @Param('tournamentId', ParseIntPipe) tournamentId: number,
    @Body() createRegistrationDto: CreateRegistrationDto,
  ) {
    return this.registrationsService.create(tournamentId, createRegistrationDto);
  }

  @Delete('registers/:playerId')
  @ApiOperation({ summary: 'Cancelar una inscripción' })
  @ApiResponse({ status: 200, description: 'Inscripción cancelada', type: Registration })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  remove(
    @Param('tournamentId', ParseIntPipe) tournamentId: number,
    @Param('playerId', ParseIntPipe) playerId: number,
  ) {
    return this.registrationsService.remove(tournamentId, playerId);
  }
}
