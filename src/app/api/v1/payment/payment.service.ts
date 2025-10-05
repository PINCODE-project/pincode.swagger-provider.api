import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { CurrencyEnum, PaymentCreateRequest, PaymentMethodsEnum, YookassaService } from "nestjs-yookassa";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { PaymentStatus, PaymentType, SubscriptionStatus } from "@prisma";

import { YookassaCallbackDto } from "./dto/callback-payment.dto";

@Injectable()
export class PaymentService {
    private readonly logger = new Logger("PaymentService");

    constructor(
        private readonly yookassaService: YookassaService,
        private readonly prismaService: PrismaService,
    ) {}

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
                currency: CurrencyEnum.RUB,
            },
            description: dto.description,
            payment_method_data: {
                type: PaymentMethodsEnum.yoo_money,
            },
            capture: true,
            confirmation: {
                type: "redirect",
                return_url: dto.returnUrl,
            },
            save_payment_method: true,
            metadata: {
                order_id: paymentEntity.id,
            },
        };

        const yookassaPayment = await this.yookassaService.createPayment(paymentData);

        await this.prismaService.payment.update({
            where: {
                id: paymentEntity.id,
            },
            data: {
                paymentId: yookassaPayment.id,
                recipientAccountId: yookassaPayment.recipient.account_id,
                recipientGatewayId: yookassaPayment.recipient.gateway_id,
            },
        });

        return { payment: yookassaPayment };
    }

    async callback(dto: YookassaCallbackDto) {
        this.logger.log(`Получен callback от Юкассы: ${JSON.stringify(dto)}`);

        // Проверяем тип уведомления
        if (dto.type !== "notification" || dto.event !== "payment.succeeded") {
            this.logger.warn(`Неподдерживаемый тип события: ${dto.event}`);
            return { success: false, message: "Event type not supported" };
        }

        // Проверяем статус оплаты
        if (dto.object.status !== "succeeded" || !dto.object.paid) {
            this.logger.warn(`Платеж не успешен: ${dto.object.id}`);
            return { success: false, message: "Payment not succeeded" };
        }

        const paymentId = dto.object.metadata.order_id;

        // Находим платеж в БД
        const payment = await this.prismaService.payment.findUnique({
            where: { id: paymentId },
            include: { user: true },
        });

        if (!payment) {
            this.logger.error(`Платеж не найден: ${paymentId}`);
            throw new BadRequestException("Payment not found");
        }

        // Проверяем, что платеж еще не обработан
        if (payment.isProcessed) {
            this.logger.warn(`Платеж уже обработан: ${paymentId}`);
            return { success: true, message: "Payment already processed" };
        }

        // Обновляем статус платежа
        await this.prismaService.payment.update({
            where: { id: paymentId },
            data: {
                status: PaymentStatus.succeeded,
                isProcessed: true,
                isTest: dto.object.test,
            },
        });

        // Обрабатываем подписку только для платежей типа SUBSCRIPTION
        if (payment.type === PaymentType.SUBSCRIPTION) {
            await this.processSubscription(payment.userId, paymentId);
        }

        this.logger.log(`Платеж успешно обработан: ${paymentId}`);
        return { success: true, message: "Payment processed successfully" };
    }

    /**
     * Создает или продлевает подписку пользователя
     */
    private async processSubscription(userId: string, paymentId: string) {
        // Проверяем наличие активной подписки
        const existingSubscription = await this.prismaService.subscription.findUnique({
            where: { userId },
        });

        const now = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        if (existingSubscription) {
            // Если подписка существует - продлеваем её
            const currentEndDate = existingSubscription.endDate || now;
            const isActive = existingSubscription.status === SubscriptionStatus.ACTIVE;

            // Если подписка активна, продлеваем от текущей даты окончания
            // Если неактивна, продлеваем от текущего момента
            const newEndDate = new Date(isActive && currentEndDate > now ? currentEndDate : now);
            newEndDate.setMonth(newEndDate.getMonth() + 1);

            await this.prismaService.subscription.update({
                where: { userId },
                data: {
                    status: SubscriptionStatus.ACTIVE,
                    endDate: newEndDate,
                    autoRenew: true,
                    paymentId: paymentId,
                },
            });

            this.logger.log(`Подписка продлена для пользователя ${userId} до ${newEndDate.toISOString()}`);
        } else {
            // Создаем новую подписку
            await this.prismaService.subscription.create({
                data: {
                    userId,
                    paymentId,
                    status: SubscriptionStatus.ACTIVE,
                    startDate: now,
                    endDate: oneMonthLater,
                    autoRenew: true,
                },
            });

            this.logger.log(`Создана новая подписка для пользователя ${userId} до ${oneMonthLater.toISOString()}`);
        }
    }
}
