import { IsIn, IsInt, IsPositive, IsString, Max, Min } from "class-validator";

export class CreateChatUserDto {

	@IsInt()
	@IsPositive()
	public user_id: number;

	@IsInt()
	@IsPositive()
	public room_id: number;

	@IsString()
	@IsIn(['user', 'owner', 'admin', 'muted', 'banned'])
	public status: 'user' | 'owner' | 'admin' | 'muted' | 'banned';
}