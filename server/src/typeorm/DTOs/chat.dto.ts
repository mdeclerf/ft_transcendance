import { IsNotEmpty, IsString } from "class-validator";
import { Room, User } from "../";

export class CreateChatDto{

	public room: Room;

	@IsString()
	@IsNotEmpty()
	public body: string;

	public user: User;
}
