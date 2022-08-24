import { IsInt, IsPositive } from "class-validator";

export class CreateBlockListDto {
	@IsInt()
	@IsPositive()
	public user_id: number;

	@IsInt()
	@IsPositive()
	public blocked_id: number;
}