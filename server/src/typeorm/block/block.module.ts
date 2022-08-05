import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockController } from './block.controller';
import { Block } from './block.entity'
import { BlockService } from './block.service';

@Module({
	imports: [TypeOrmModule.forFeature([Block])],
	controllers: [BlockController],
	providers: [BlockService],
	exports: [BlockService]
})
export class BlockModule {}
