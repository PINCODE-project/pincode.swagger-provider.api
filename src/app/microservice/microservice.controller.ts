import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { MicroserviceService } from "./microservice.service";
import { CreateMicroserviceDto } from "./dto/create-microservice.dto";

import { Authorization } from "@/auth/decorators/auth.decorator";
import { GetMicroserviceDto } from "@/microservice/dto/get-microservice.dto";
import { Request } from "express";

@ApiTags("microservice")
@Controller("microservice")
export class MicroserviceController {
    constructor(private readonly microserviceService: MicroserviceService) {}

    @ApiOperation({ summary: "Создание микросервиса (схемы)" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Body() dto: CreateMicroserviceDto) {
        return this.microserviceService.create(dto);
    }

    // @Get()
    // findAll() {
    //     return this.microserviceService.findAll();
    // }
    //

    @ApiOperation({ summary: "Получение схемы" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get(":id")
    findOne(@Req() req: Request, @Param() dto: GetMicroserviceDto) {
        return this.microserviceService.findOne(dto, req.session.userId);
    }

    //
    // @Patch(":id")
    // update(
    //     @Param("id") id: string,
    //     @Body() updateMicroserviceDto: UpdateMicroserviceDto,
    // ) {
    //     return this.microserviceService.update(+id, updateMicroserviceDto);
    // }
    //
    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //     return this.microserviceService.remove(+id);
}
