import { Module } from '@nestjs/common';
import { PlayersModule } from './modules/players/players.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { RegistrationsModule } from './modules/registrations/registrations.module';

@Module({
  imports: [PlayersModule, TournamentsModule, RegistrationsModule],
})
export class AppModule {}
