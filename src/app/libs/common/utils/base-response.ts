import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

export const ApiBaseResponse = <TModel extends Type<any>>(model: TModel, description?: string) => {
    return applyDecorators(
        ApiExtraModels(model),
        ApiOkResponse({
            description,
            schema: {
                $ref: getSchemaPath(model),
            },
        }),
    );
};
