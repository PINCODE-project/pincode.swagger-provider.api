import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Authorization } from "@/modules/auth/decorators/auth.decorator";
import { Authorized } from "@/modules/auth/decorators/authorized.decorator";

import { YookassaCallbackDto } from "./dto/callback-payment.dto";
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';

@ApiTags('payment')
@Controller('/v1/payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {
    }

    @ApiOperation({summary: 'Создание платежа'})
    @Authorization()
    @Post()
    create(@Authorized("id") userId: string, @Body() dto: CreatePaymentDto) {
        return this.paymentService.createPayment(userId, dto);
    }

    @ApiOperation({summary: 'Проверка ручки для изменения статуса платежа'})
    @Get("callback")
    callbackHealthy() {
        return true;
    }

    @ApiOperation({summary: 'Изменение статуса платежа'})
    @Post("callback")
    callback(@Body() dto: YookassaCallbackDto) {
        return this.paymentService.callback(dto);
    }
}
