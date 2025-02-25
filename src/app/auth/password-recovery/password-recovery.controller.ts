import { Body, Controller, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";

import { NewPasswordDto } from "./dto/new-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { PasswordRecoveryService } from "./password-recovery.service";
import { ApiExcludeEndpoint } from "@nestjs/swagger";

@Controller("auth/password-recovery")
export class PasswordRecoveryController {
    constructor(private readonly passwordRecoveryService: PasswordRecoveryService) {}

    @ApiExcludeEndpoint()
    @Post("reset")
    @HttpCode(HttpStatus.OK)
    public async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.passwordRecoveryService.resetPassword(dto);
    }

    @ApiExcludeEndpoint()
    @Post("new/:token")
    @HttpCode(HttpStatus.OK)
    public async newPassword(@Body() dto: NewPasswordDto, @Param("token") token: string) {
        return this.passwordRecoveryService.newPassword(dto, token);
    }
}
