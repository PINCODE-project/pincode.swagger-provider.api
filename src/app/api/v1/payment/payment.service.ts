import { Injectable, Logger } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CurrencyEnum, PaymentCreateRequest, PaymentMethodsEnum, YookassaService } from "nestjs-yookassa";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { PaymentStatus } from "@prisma";

@Injectable()
export class PaymentService {
    private readonly logger = new Logger("PaymentService");

    constructor(
        private readonly yookassaService: YookassaService,
        private readonly prismaService: PrismaService
    ) {
    }

    async createPayment(userId: string, dto: CreatePaymentDto) {
        const paymentEntity = await this.prismaService.payment.create({
            data: {
                type: dto.type,
                amount: dto.amount,
                description: dto.description,
                status: PaymentStatus.pendind,
                userId: userId,
                isProcessed: false,
            },
        });

        const paymentData: PaymentCreateRequest = {
            amount: {
                value: dto.amount,
                currency: CurrencyEnum.RUB
            },
            description: dto.description,
            payment_method_data: {
                type: PaymentMethodsEnum.yoo_money
            },
            capture: false,
            confirmation: {
                type: 'redirect',
                return_url: dto.returnUrl
            },
            save_payment_method: true,
            metadata: {
                order_id: paymentEntity.id,
            },
        }

        const yookassaPayment = await this.yookassaService.createPayment(paymentData);

        await this.prismaService.payment.update({
            where: {
                id: paymentEntity.id,
            },
            data: {
                paymentId: yookassaPayment.id,
                recipientAccountId: yookassaPayment.recipient.account_id,
                recipientGatewayId: yookassaPayment.recipient.gateway_id
            },
        });

        return { payment: yookassaPayment };
    }

    async callback(dto: any) {
        this.logger.log(dto, JSON.stringify(dto));
    }
}
