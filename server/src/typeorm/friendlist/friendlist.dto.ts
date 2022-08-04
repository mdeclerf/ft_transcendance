import { IsInt, IsPositive } from "class-validator";
import { User } from "../typeorm.module";

export class CreateFriendlistDto {
	@IsInt()
	@IsPositive()
	public user: User;

	@IsInt()
	@IsPositive()
	public friend: User;
}