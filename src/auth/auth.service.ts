import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { UserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';
import { AuthenticationProvider } from './auth';

@Injectable()
export class AuthService implements AuthenticationProvider {
	constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
	
	async validateUser(details: UserDetails) {
		const { id } = details;
		const user = await this.userRepo.findOne({ id }); // TO FIX: 1:13:03 https://www.youtube.com/watch?v=vGafqCNCCSs
		if (user) return user;
		const newUser = await this.createUser(details);
	}
	createUser(details: UserDetails) {
		
	}
	findUser() {
		throw new Error('Method not implemented.');
	}

}
