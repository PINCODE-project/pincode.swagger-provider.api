import { PartialType } from "@nestjs/swagger";

import { CreateOpenapiSchemeDto } from "./create-openapi-scheme.dto";

export class UpdateOpenapiSchemeDto extends PartialType(CreateOpenapiSchemeDto) {}
