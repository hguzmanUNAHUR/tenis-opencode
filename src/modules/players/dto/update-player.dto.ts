import { PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsDateString, IsOptional, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, PlayerStatus } from '../entities/player.entity';
import { CreatePlayerDto } from './create-player.dto';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
  @ApiProperty({ enum: PlayerStatus, required: false })
  @IsOptional()
  @IsEnum(PlayerStatus)
  status?: PlayerStatus;

  @ApiProperty({ example: 1500, required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  rankingPoints?: number;
}
