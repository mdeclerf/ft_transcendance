import { IsInt, IsPositive, Max, Min } from "class-validator";

export class CreateChatUserDto{

	@IsInt()
	@IsPositive()
	public room_number: number;

	@IsInt()
	@IsPositive()
	public user_id: number;

	@IsInt()
	@Min(0)
	@Max(3)
	public status: number;

	public endStatusDate: Date;
}