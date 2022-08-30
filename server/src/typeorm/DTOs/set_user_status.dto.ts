import { IsIn, IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class SetUserStatusDto {

	@IsInt()
	@IsPositive()
	public user_id: number;

	@IsString()
	@IsNotEmpty()
	public room_name: string;

	@IsString()
	@IsIn(['user', 'owner', 'admin', 'muted', 'banned'])
	public status: 'user' | 'owner' | 'admin' | 'muted' | 'banned';

	@IsString()
	public time: '60000' | '300000' | '3600000';
}