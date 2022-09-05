import { IsInt, IsPositive } from "class-validator";

export class CreateSubscriptionDto {
	@IsInt()
	@IsPositive()
	public user_id: number;

	@IsInt()
	@IsPositive()
	public friend_id: number;
}