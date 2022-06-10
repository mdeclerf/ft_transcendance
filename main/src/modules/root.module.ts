import { Module } from '@nestjs/common';
import { RootController } from './controllers/root/root.controller';
import { RootService } from './services/root/root.service';

@Module({
	imports: [],
	controllers: [RootController],
	providers: [RootService],
})
export class RootModule {}
