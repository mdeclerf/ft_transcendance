import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from "class-validator";
import { User } from "../typeorm.module";

export class CreateChatDto{
	@IsInt()
	@IsPositive()
	public room_number: number;

	@IsString()
	@IsNotEmpty()
	public body: string;

	public user: User;
}
