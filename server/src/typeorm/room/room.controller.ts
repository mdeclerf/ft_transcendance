import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { CreateRoomDto } from './room.dto';
import { Room } from './room.entity';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {

	@Inject(RoomService)
	private readonly service: RoomService;

	@Get(":name")
	public getRoom(@Param('name') name: string) : Promise<Room> {
		return this.service.getRoomByName(name);
	}

	@Get("c/:name")
	public getRoomOrCreate(@Param('name') name: string) : Promise<Room> {
		return this.service.getRoomOrCreate(name);
	}

	@Post()
	public createRoom(@Body() body: CreateRoomDto): Promise<Room> {
		console.log(body.name);
		//return this.service.getRoomOrCreate(body.name);
		return this.service.createRoom(body);
	}
}
