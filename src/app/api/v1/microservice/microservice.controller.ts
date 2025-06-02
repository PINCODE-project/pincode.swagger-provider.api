import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { MicroserviceService } from "./microservice.service";
import { CreateMicroserviceDto, CreateMicroserviceResponseDto } from "./dto/create-microservice.dto";
import { Authorization } from "@/modules/auth/decorators/auth.decorator";
import { ApiBaseResponse, ApiErrorResponse } from "@/common/utils/base-response";
import { GetMicroserviceDto, GetMicroserviceResponseDto } from "./dto/get-microservice.dto";
import { Authorized } from "@/modules/auth/decorators/authorized.decorator";

@ApiTags("microservice")
@Controller("/v1/microservice")
export class MicroserviceController {
    constructor(private readonly microserviceService: MicroserviceService) {}

    @ApiOperation({ summary: "Создание микросервиса" })
    @ApiBaseResponse(200, CreateMicroserviceResponseDto, "Созданный проект")
    @ApiErrorResponse(400, "CreateMicroserviceProjectNotFound", "Project not found!", "Проект не найден")
    @ApiErrorResponse(409, "CreateMicroserviceConflict", "The microservice already exists!", "Микросервис уже существует")
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Body() dto: CreateMicroserviceDto) {
        return this.microserviceService.create(dto);
    }

    @ApiOperation({ summary: "Получение микросервиса" })
    @ApiBaseResponse(200, GetMicroserviceResponseDto, "Объект микросервиса")
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get(":id")
    findOne(@Authorized("id") userId: string, @Param() dto: GetMicroserviceDto) {
        return this.microserviceService.findOne(dto, userId);
    }
}
