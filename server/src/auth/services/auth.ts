import { User } from "../../typeorm/";
import { UserDetails } from "../../utils/types";

export interface IAuthService {
	validateUser(details: UserDetails);
	createUser(details: UserDetails);
	findUser(intraId: string): Promise<User | undefined>;
}