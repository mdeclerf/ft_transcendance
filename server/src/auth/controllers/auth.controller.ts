import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { RequestWithUser } from 'src/utils/types';
import { AuthenticatedGuard, IntraAuthGuard } from '../guards/intra-oauth.guard';

@Controller('auth')
export class AuthController {
	
	constructor(
		@Inject(UserService) private readonly userService: UserService,
	) {}

	@Get('login')
	@UseGuards(IntraAuthGuard)
	login() {
		return;
	}

	@Get('redirect')
	@UseGuards(IntraAuthGuard)
	redirect(@Res() res: Response) {
		res.redirect(`http://${process.env.REACT_APP_IP}:3000/`);
	}

	@Get('status')
	@UseGuards(AuthenticatedGuard)
	status(@Req() req: RequestWithUser) {
		this.userService.setStatus(req.user.id, 'online');
		return req.user;
	}

	@Get('logout')
	@UseGuards(AuthenticatedGuard)
	logout(@Req() req: RequestWithUser) {
		this.userService.secondFactorAuthenticate(req.user.id, false);
		this.userService.setStatus(req.user.id, 'offline');
		req.logOut((err) => {
			if (err) throw err;
		});
	}
}
