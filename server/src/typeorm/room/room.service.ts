import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './room.dto';
import { Room } from './room.entity';

@Injectable()
export class RoomService {

	@InjectRepository(Room)
	private readonly repository: Repository<Room>;
	
	public getRoomByName(name: string): Promise<Room> {
		return this.repository.findOneBy({ name: name });
	}

	public getRoomById(id: number): Promise<Room> {
		return this.repository.findOneBy({ id: id });
	}
	
	public createRoom(body: CreateRoomDto): Promise<Room> {
		
		const room: Room = new Room();

		room.name = body.name;
		room.type = body.type;
		if (body.hash)
			room.hash = body.hash;
		
		return this.repository.save(room);
	}
}
