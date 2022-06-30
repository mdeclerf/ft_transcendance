import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway'
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { ApiModule } from './api/api.module';
import { ChatModule } from './api/chat/chat.module';


const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath, isGlobal: true }),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService}),
		ApiModule,
		ChatModule,
	],
	controllers: [AppController],
	providers: [AppService, AppGateway],
})
export class AppModule {}
