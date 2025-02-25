import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { Request } from "express";

import { ConfirmationDto } from "./dto/confirmation.dto";
import { EmailConfirmationService } from "./email-confirmation.service";
import { ApiExcludeEndpoint } from "@nestjs/swagger";

@Controller("auth/email-confirmation")
export class EmailConfirmationController {
    constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

    @ApiExcludeEndpoint()
    @Post()
    @HttpCode(HttpStatus.OK)
    public async newVerification(@Req() req: Request, @Body() dto: ConfirmationDto) {
        return this.emailConfirmationService.newVerification(req, dto);
    }
}
