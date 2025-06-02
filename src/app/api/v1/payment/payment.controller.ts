import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Authorization } from "@/modules/auth/decorators/auth.decorator";
import { Authorized } from "@/modules/auth/decorators/authorized.decorator";

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

    @ApiOperation({summary: 'Изменении статуса платежа'})
    @Post("callback")
    callback(@Body() dto: any) {
        return this.paymentService.callback(dto);
    }
}
