import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from "@nestjs/swagger";

export class MetaResponseDto {
    @ApiProperty({ description: "Время запроса", example: "2025-03-03T18:22:08.560Z" })
    timestamp: string;

    @ApiProperty({ description: "Код ответа", example: 200 })
    statusCode: number;
}

export class BaseResponse<TData> {
    @ApiProperty()
    meta: MetaResponseDto;

    data: TData[];
}

export const ApiBaseResponse = <TModel extends Type<any>>(model: TModel, description?: string) => {
    return applyDecorators(
        ApiExtraModels(BaseResponse, model),
        ApiOkResponse({
            description,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(BaseResponse) },
                    {
                        properties: {
                            data: {
                                $ref: getSchemaPath(model),
                            },
                        },
                    },
                ],
            },
        }),
    );
};
