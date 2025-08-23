import { ApiProperty } from "@nestjs/swagger";
import { PaymentType } from "@prisma";

export class CreatePaymentDto {
    @ApiProperty({ description: "Товар", example: PaymentType.SUBSCRIPTION })
    type: PaymentType

    @ApiProperty({ description: "Сумма оплаты", example: 250 })
    amount: number;

    @ApiProperty({ description: "Описание заказа", example: "Подписка на сервис Swagger Provider" })
    description: string;

    @ApiProperty({ description: "Ссылка редиректа после оплаты", example: "https://swagger-provider.com" })
    returnUrl: string;
}
