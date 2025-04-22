import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { OpenapiSchemeService } from "./openapi-scheme.service";
import { CreateOpenapiSchemeDto } from "./dto/create-openapi-scheme.dto";
import { UpdateOpenapiSchemeDto } from "./dto/update-openapi-scheme.dto";

@ApiTags("openapi-scheme")
@Controller("openapi-scheme")
export class OpenapiSchemeController {
    constructor(private readonly openapiSchemeService: OpenapiSchemeService) {}

    // @Post()
    // create(@Body() createOpenapiSchemeDto: CreateOpenapiSchemeDto) {
    //     return this.openapiSchemeService.create(createOpenapiSchemeDto);
    // }
    //
    // @Get()
    // findAll() {
    //     return this.openapiSchemeService.findAll();
    // }
    //
    // @Get(":id")
    // findOne(@Param("id") id: string) {
    //     return this.openapiSchemeService.findOne(+id);
    // }
    //
    // @Patch(":id")
    // update(@Param("id") id: string, @Body() updateOpenapiSchemeDto: UpdateOpenapiSchemeDto) {
    //     return this.openapiSchemeService.update(+id, updateOpenapiSchemeDto);
    // }
    //
    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //     return this.openapiSchemeService.remove(+id);
    // }
}
