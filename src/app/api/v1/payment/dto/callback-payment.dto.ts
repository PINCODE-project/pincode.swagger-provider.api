import { ApiProperty } from "@nestjs/swagger";

export class YookassaCallbackDto {
    @ApiProperty()
    type: string;

    @ApiProperty()
    event: string;

    @ApiProperty()
    object: {
        id: string;
        status: string;
        amount: {
            value: string;
            currency: string;
        };
        recipient: {
            account_id: string;
            gateway_id: string;
        };
        test: boolean;
        paid: boolean;
        metadata: {
            order_id: string;
        };
    };
}