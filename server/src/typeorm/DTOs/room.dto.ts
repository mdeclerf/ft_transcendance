import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {

	@IsNotEmpty()
	@IsString()
	public name: string;

	@IsNotEmpty()
	@IsString()
	public type: 'public' | 'protected' | 'private';

	@IsString()
	public hash: string;
}