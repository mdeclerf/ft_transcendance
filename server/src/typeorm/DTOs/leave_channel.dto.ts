import { IsIn, IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class LeaveChannelDto {

	@IsInt()
	@IsPositive()
	public user: number;

	@IsString()
	@IsNotEmpty()
	public room: string;
}