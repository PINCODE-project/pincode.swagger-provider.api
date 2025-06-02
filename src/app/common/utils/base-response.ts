import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { applyDecorators, Type } from "@nestjs/common";

export const ApiBaseResponse = <TModel extends Type<any>>(
    status: number,
    model: TModel,
    description?: string,
    isArray: boolean = false,
) => {
    return applyDecorators(
        ApiExtraModels(model),
        ApiResponse({
            status: status,
            description,
            schema: isArray
                ? {
                      type: "array",
                      items: { $ref: getSchemaPath(model) },
                  }
                : { $ref: getSchemaPath(model) },
        }),
    );
};

export const ApiErrorResponse = <TModel extends Type<any>>(
    status: number,
    className: string,
    message: string,
    description?: string,
) => {
    class ErrorResponseModel {
        @ApiProperty({ example: message })
        message: string;

        @ApiProperty({ example: status })
        statusCode: number;
    }

    Object.defineProperty(ErrorResponseModel, "name", { value: `${className}ErrorResponse` });

    return applyDecorators(
        ApiExtraModels(ErrorResponseModel),
        ApiResponse({
            status: status,
            description,
            schema: { $ref: getSchemaPath(ErrorResponseModel) },
        }),
    );
};
