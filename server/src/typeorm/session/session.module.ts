import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionController } from './session.controller';
import { Session } from './session.entity';
import { SessionService } from './session.service';

@Module({
	imports: [TypeOrmModule.forFeature([Session])],
	controllers: [SessionController],
	providers: [SessionService],
	exports: [SessionService]
})
export class SessionModule {}
