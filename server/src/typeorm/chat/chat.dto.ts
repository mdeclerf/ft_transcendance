import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from "class-validator";
import { User, Room } from "../typeorm.module";

export class CreateChatDto{

	public room: Room;

	@IsString()
	@IsNotEmpty()
	public body: string;

	public user: User;
}
