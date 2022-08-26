import { IsInt, IsPositive, Max, Min } from "class-validator";
import { Room } from "../entities/room.entity";
import { User } from "../entities/user.entity";

export class CreateChatUserDto {

	public room_name: string;

	public usernme: string;

	public status: string;
}