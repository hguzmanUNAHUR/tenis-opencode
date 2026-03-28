import { Module } from '@nestjs/common';
import { PlayersModule } from './modules/players/players.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';

@Module({
  imports: [PlayersModule, TournamentsModule],
})
export class AppModule {}
