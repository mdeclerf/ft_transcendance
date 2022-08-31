import { IsIn, IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";
import { User } from "../entities/user.entity";

export class LeaveChannelDto {

	public user: User;

	@IsString()
	@IsNotEmpty()
	public room: string;
}