import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Inject, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { AuthenticatedGuard } from "../auth/guards/intra-oauth.guard";
import { AuthService } from "../auth/services/auth.service";
import { TwoFactorAuthenticationService } from "./2fa.service";
import { UserService } from "./user.service";
import { RequestWithUser } from "../utils/types";
import { TwoFactorAuthCodeDto } from "src/utils/twoFactorAuthCode.dto";

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(
		@Inject(TwoFactorAuthenticationService) private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		@Inject(UserService) private readonly userService: UserService,
		@Inject(AuthService) private readonly authService: AuthService
	) {}

	@Post('generate')
	@UseGuards(AuthenticatedGuard)
	async register(@Res() res: Response, @Req() req: RequestWithUser) {
		if (!req.user.isTwoFactorAuthenticationEnabled) {
			const { otpauthURL } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(req.user);

			return this.twoFactorAuthenticationService.pipeQrCodeStream(res, otpauthURL);
		}
		return null;
	}

	@Post('turn_on')
	@HttpCode(200)
	@UseGuards(AuthenticatedGuard)
	async turnOnTwoFactorAuthentication(@Req() req: RequestWithUser, @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto) {
		const isValid = this.twoFactorAuthenticationService.isTwoFactorAuthCodeValid(twoFactorAuthCode, req.user);

		if (!isValid) throw new UnauthorizedException('Wrong authentication code');

		await this.userService.enableTwoFactorAuthentication(req.user.id);
	}

	@Post('turn_off')
	@HttpCode(200)
	@UseGuards(AuthenticatedGuard)
	async turnOffTwoFactorAuthentication(@Req() req: RequestWithUser, @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto) {
		const isValid = this.twoFactorAuthenticationService.isTwoFactorAuthCodeValid(twoFactorAuthCode, req.user);

		if (!isValid) throw new UnauthorizedException('Wrong authentication code');

		await this.userService.disableTwoFactorAuthentication(req.user.id);
	}


	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(AuthenticatedGuard)
	async authenticate(
		@Req() req: RequestWithUser,
		@Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
	) {
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthCodeValid(
			twoFactorAuthCode, req.user
		);

		if (!isCodeValid) throw new UnauthorizedException('Wrong authentication code');

		this.authService.validateUser(req.user);

		this.userService.secondFactorAuthenticate(req.user.id, true);

		return req.user;
	}
}