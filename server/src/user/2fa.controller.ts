import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Inject, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { AuthenticatedGuard } from "../auth/guards/intra-oauth.guard";
import { AuthService } from "../auth/services/auth.service";
import { TwoFactorAuthenticationService } from "./2fa.service";
import { UserService } from "./user.service";
import { RequestWithUser } from "../utils/types";

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(
		@Inject('2FA_SERVICE') private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		@Inject('USER_SERVICE') private readonly userService: UserService,
		@Inject('AUTH_SERVICE') private readonly authService: AuthService
	) {}

	@Post('generate')
	@UseGuards(AuthenticatedGuard)
	async register(@Res() res: Response, @Req() req: RequestWithUser) {
		const { otpauthURL } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(req.user);

		return this.twoFactorAuthenticationService.pipeQrCodeStream(res, otpauthURL);
	}

	@Post('on')
	@HttpCode(200)
	@UseGuards(AuthenticatedGuard)
	async turnOnTwoFactorAuthentication(@Req() req: RequestWithUser, @Body() twoFactorAuthCode: string) {
		const isValid = this.twoFactorAuthenticationService.isTwoFactorAuthCodeValid(twoFactorAuthCode, req.user);

		if (!isValid) throw new UnauthorizedException('Wrong authentication code');

		await this.userService.enableTwoFactorAuthentication(req.user.id);
	}

	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(AuthenticatedGuard)
	async authenticate(
		@Req() req: RequestWithUser,
		@Body() twoFactorAuthCode: string,
	) {
		console.log('auth code', twoFactorAuthCode);
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthCodeValid(
			twoFactorAuthCode, req.user
		);
		console.log('code', isCodeValid);
		if (!isCodeValid) throw new UnauthorizedException('Wrong authentication code');

		this.authService.validateUser(req.user);

		return req.user;
	}
}