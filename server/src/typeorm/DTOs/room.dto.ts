import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateRoomDto {

	@IsNotEmpty()
	@IsString()
	public name: string;

	@IsInt()
	@Min(0)
	@Max(2)
	public type: number;

	@IsString()
	public hash: string;
}