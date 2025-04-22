import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { PrismaService } from "./prisma/prisma.service";

@Controller()
export class AppController {
    constructor(
        private readonly healthCheckService: HealthCheckService,
        private readonly prismaService: PrismaService,
    ) {}

    @ApiOperation({ summary: "Проверка работоспособности БД" })
    @ApiTags("system")
    @Get("/health")
    @HealthCheck()
    public async getHealth() {
        return this.healthCheckService.check([() => this.prismaService.isHealthy()]);
    }
}
