import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { MicroserviceService } from "./microservice.service";
import { CreateMicroserviceDto } from "./dto/create-microservice.dto";
import { Authorization } from "@/modules/auth/decorators/auth.decorator";
import { GetMicroserviceDto } from "./dto/get-microservice.dto";
import { Authorized } from "@/modules/auth/decorators/authorized.decorator";
import { UpdateMicroserviceParamsDto, UpdateMicroserviceDto } from "./dto/update-microservice.dto";
import { DeleteMicroserviceDto } from "./dto/delete-microservice.dto";
import { RefreshMicroserviceDto } from "./dto/refresh-microservice.dto";
import {
    ApiCreateMicroservice,
    ApiGetMicroservice,
    ApiUpdateMicroservice,
    ApiDeleteMicroservice,
    ApiRefreshMicroservice,
} from "./microservice.swagger";

@ApiTags("microservice")
@Controller("/v1/microservice")
export class MicroserviceController {
    constructor(private readonly microserviceService: MicroserviceService) {}

    @ApiCreateMicroservice()
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Body() dto: CreateMicroserviceDto) {
        return this.microserviceService.create(dto);
    }

    @ApiGetMicroservice()
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get(":id")
    findOne(@Authorized("id") userId: string, @Param() dto: GetMicroserviceDto) {
        return this.microserviceService.findOne(dto, userId);
    }

    @ApiUpdateMicroservice()
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Patch(":id")
    update(
        @Authorized("id") userId: string,
        @Param() params: UpdateMicroserviceParamsDto,
        @Body() dto: UpdateMicroserviceDto,
    ) {
        return this.microserviceService.update(params.id, dto, userId);
    }

    @ApiDeleteMicroservice()
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Delete(":id")
    remove(@Authorized("id") userId: string, @Param() dto: DeleteMicroserviceDto) {
        return this.microserviceService.remove(dto.id, userId);
    }

    @ApiRefreshMicroservice()
    @HttpCode(HttpStatus.OK)
    @Post(":id/refresh")
    refresh(@Param() dto: RefreshMicroserviceDto) {
        return this.microserviceService.refresh(dto);
    }
}
