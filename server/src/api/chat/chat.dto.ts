import { IsNotEmpty, IsString } from "class-validator";

export class CreateChatDto{
	public room_number: number;

	@IsString()
	@IsNotEmpty()
	public body: string;
}