import { IsInt, IsNotEmpty, Max, Min } from "class-validator";
import { User } from "../";

export class CreateGameDto {

	public player_1: User;
	
	public player_2: User;
	
	@IsInt()
	@Min(0)
	@Max(6)
	public player_1_score: number;

	@IsInt()
	@Min(0)
	@Max(6)
	public player_2_score: number;

	@IsNotEmpty()
	public mode: string;
}