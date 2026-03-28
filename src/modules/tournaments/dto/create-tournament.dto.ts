import { IsString, IsEnum, IsDateString, IsInt, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TournamentType, TournamentCategory } from '../entities/tournament.entity';

export class CreateTournamentDto {
  @ApiProperty({ example: 'ATP Buenos Aires 2026' })
  @IsString()
  name: string;

  @ApiProperty({ enum: TournamentType, example: TournamentType.SINGLES })
  @IsEnum(TournamentType)
  type: TournamentType;

  @ApiProperty({ enum: TournamentCategory, example: TournamentCategory.ATP_250 })
  @IsEnum(TournamentCategory)
  category: TournamentCategory;

  @ApiProperty({ example: '2026-05-15' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-05-25' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 32 })
  @IsInt()
  @IsPositive()
  maxParticipants: number;

  @ApiProperty({ enum: ['MALE', 'FEMALE'], required: false, example: 'MALE' })
  @IsOptional()
  @IsString()
  genderRestriction?: 'MALE' | 'FEMALE';
}
