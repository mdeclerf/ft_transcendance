import { IsDate, IsNotEmpty } from "class-validator";

export class CreateSessionDto {

	@IsDate()
	public expiredAt: number;

	@IsNotEmpty()
	public id: string;

	public json: string;
}
