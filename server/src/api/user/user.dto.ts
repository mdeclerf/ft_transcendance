import { IsNotEmpty, IsUrl } from "class-validator";

export class CreateUserDto {

	@IsNotEmpty()
	public intraId: string;

	@IsNotEmpty()
	public username: string;

	@IsNotEmpty()
	public displayName : string;

	@IsUrl()
	public photoURL: string;

	public twoFactorAuthenticationSecret: string;
}