import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { MicroserviceService } from "./microservice.service";
import { CreateMicroserviceDto } from "./dto/create-microservice.dto";

import { Authorization } from "@/auth/decorators/auth.decorator";
import { GetMicroserviceDto } from "@/microservice/dto/get-microservice.dto";
import { Authorized } from "@/auth/decorators/authorized.decorator";

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

    @ApiOperation({ summary: "Получение схемы" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get(":id")
    findOne(@Authorized("id") userId: string, @Param() dto: GetMicroserviceDto) {
        return this.microserviceService.findOne(dto, userId);
    }
}
