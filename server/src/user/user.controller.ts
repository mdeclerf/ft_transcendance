import { Controller, Get, Inject, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { join } from 'path';
import path = require('path');
import { AuthenticatedGuard } from '../auth/guards/intra-oauth.guard';
import { UserService } from './user.service';
import { UserDetails } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

const storage = {
	storage: diskStorage({
		destination: './uploads/profile_pictures',
		filename: (req, file, cb) => {
			const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
			const extension: string = path.parse(file.originalname).ext;

			cb(null, `${filename}${extension}`);
		}
	})
}

@Controller('user')
export class UserController {
	constructor(@Inject(UserService) private readonly userService: UserService) {}

	@Post('upload')
	@UseGuards(AuthenticatedGuard)
	@UseInterceptors(FileInterceptor('file', storage))
	uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
		const user: UserDetails = req.user;

		user.photoURL = "http://localhost:3001/api/user/profile_image/" + file.filename;

		return this.userService.updateOne(user);
	}

	@Get('profile_image/:imagename')
	findProfileImage(@Param('imagename') imagename: string, @Res() res: Response) {
		return res.sendFile(join(process.cwd(), 'uploads/profile_pictures/' + imagename));
	}

	@Get('name_change')
	@UseGuards(AuthenticatedGuard)
	async setUsername(@Query('username') newUsername: string, @Req() req: Request, @Res() res: Response) {
		const user: UserDetails = req.user;

		const taken = await this.userService.findUserByUsername(newUsername);

		if (taken)
			return res.json({ taken: true, user: user });

		user.username = newUsername;

		this.userService.updateOne(user);
		return res.json({ taken: false, user: user });
	}

	@Get('leaderboard')
	@UseGuards(AuthenticatedGuard)
	async getLeader() {
		const leader = await this.userService.findLeader();
		return leader;
	}

	@Get(':username')
	@UseGuards(AuthenticatedGuard)
	async getUser(@Param('username') username: string, @Res() res: Response) {
		const user = await this.userService.findUserByUsername(username);

		if (user) {
			const games = await this.userService.findMatches(user.id);
			return res.json({ found: true, user: user, games: games });
		} else {
			return res.json({ found: false, user: null, games: null });
		}
	}
}
