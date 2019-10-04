import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './services/database/database.module';
import { AuthApiModule } from './api/auth-api/auth-api.module';

@Module({
  imports: [
    DatabaseModule,
    AuthApiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
