import { IsInt, IsPositive } from "class-validator";

export class CreateFriendlistDto {
	@IsInt()
	@IsPositive()
	public user_id: number;

	@IsInt()
	@IsPositive()
	public friend_id: number;
}