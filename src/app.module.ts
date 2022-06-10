import { Module } from '@nestjs/common';
import { RootModule } from './modules/root.module';

@Module({
  imports: [RootModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
