import { IsString, IsEmail, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/player.entity';

export class CreatePlayerDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Martinez' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'juan@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1995-03-15' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 'ARG' })
  @IsString()
  nationality: string;
}
