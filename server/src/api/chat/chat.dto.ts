import { IsNotEmpty, IsString } from "class-validator";

export class CreateChatDto{
	public room_number: number;
	public createdAt: Date;

	@IsString()
	@IsNotEmpty()
	public body: string;
}