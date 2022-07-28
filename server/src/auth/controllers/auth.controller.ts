import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard, IntraAuthGuard } from '../guards/intra-oauth.guard';

@Controller('auth')
export class AuthController {
	
	@Get('login')
	@UseGuards(IntraAuthGuard)
	login() {
		return;
	}

	@Get('redirect')
	@UseGuards(IntraAuthGuard)
	redirect(@Res() res: Response) {
		res.redirect('http://localhost:3000/game');
	}

	@Get('status')
	@UseGuards(AuthenticatedGuard)
	status(@Req() req: Request) {
		return req.user;
	}

	@Get('logout')
	@UseGuards(AuthenticatedGuard)
	logout(@Req() req: Request) {
		req.logOut((err) => {
			if (err) throw err;
		});
		// req.session.destroy((err) => {
		// 	if (err) throw err;
		// })
	}
}
