import { IsIn, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateRoomDto {

	@IsNotEmpty()
	@IsString()
	public name: string;

	@IsNotEmpty()
	@IsString()
	@IsIn(['public', 'protected', 'private'])
	public type: 'public' | 'protected' | 'private';

	@IsString()
	public hash: string;
}