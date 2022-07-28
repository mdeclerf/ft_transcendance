import { Inject, Injectable } from "@nestjs/common";
import { Response } from "express";
import { authenticator } from "otplib";
import { toFileStream } from "qrcode";
import { User } from "src/typeorm/typeorm.module";
import { UserService } from "./user.service";

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(@Inject('USER_SERVICE') private readonly userService: UserService) {}

	async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();

		const otpauthURL = authenticator.keyuri(user.intraId, 'ft_transcendence', secret);

		await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);

		return { secret, otpauthURL }
	}

	async pipeQrCodeStream(stream: Response, otpauthURL: string) {
		return toFileStream(stream, otpauthURL);
	}

	isTwoFactorAuthCodeValid(twoFactorAuthCode: string, user: User) {
		return authenticator.verify({
			token: twoFactorAuthCode,
			secret: user.twoFactorAuthenticationSecret,
		})
	}
}