import { PartialType } from '@nestjs/swagger';
import { IsString, IsEnum, IsDateString, IsInt, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TournamentType, TournamentCategory, TournamentStatus } from '../entities/tournament.entity';
import { CreateTournamentDto } from './create-tournament.dto';

export class UpdateTournamentDto extends PartialType(CreateTournamentDto) {
  @ApiProperty({ enum: TournamentStatus, required: false })
  @IsOptional()
  @IsEnum(TournamentStatus)
  status?: TournamentStatus;
}
