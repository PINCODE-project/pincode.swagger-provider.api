import { ApiProperty } from "@nestjs/swagger";
import { SubscriptionStatus } from "@prisma";
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class Subscription {
    @ApiProperty({
        type: "string",
        format: "uuid",
        description: "ID подписки",
        example: "4dbee41b-de92-497c-84ba-9f4530ad8101",
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        enum: SubscriptionStatus,
        description: "Статус подписки",
        example: SubscriptionStatus.ACTIVE,
    })
    @IsEnum(SubscriptionStatus)
    status: SubscriptionStatus;

    @ApiProperty({
        description: "Автопродление подписки",
        example: true,
    })
    @IsBoolean()
    autoRenew: boolean;

    @ApiProperty({
        type: "string",
        format: "date-time",
        description: "Дата начала подписки",
        example: "2025-10-01T00:00:00.000Z",
    })
    startDate: string;

    @ApiProperty({
        type: "string",
        format: "date-time",
        description: "Дата окончания подписки",
        example: "2025-11-01T00:00:00.000Z",
        required: false,
    })
    @IsOptional()
    @IsString()
    endDate: string | null;

    @ApiProperty({
        type: "string",
        format: "uuid",
        description: "ID платежа",
        required: false,
        example: "5a37f8a8-e966-462e-9e92-91c726053bc0",
    })
    @IsOptional()
    @IsUUID()
    paymentId: string | null;

    @ApiProperty({
        type: "string",
        format: "uuid",
        description: "ID пользователя",
        example: "5a37f8a8-e966-462e-9e92-91c726053bc0",
    })
    @IsUUID()
    userId: string;

    @ApiProperty({
        type: "string",
        format: "date-time",
        description: "Дата создания",
        example: "2025-10-01T00:00:00.000Z",
    })
    createdAt: string;

    @ApiProperty({
        type: "string",
        format: "date-time",
        description: "Дата обновления",
        example: "2025-10-01T00:00:00.000Z",
    })
    updatedAt: string;
}
