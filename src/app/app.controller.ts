import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";
import { PrismaService } from "@/modules/prisma/prisma.service";

@ApiTags("system")
@Controller("v1")
export class AppController {
    constructor(
        private readonly healthCheckService: HealthCheckService,
        private readonly prismaService: PrismaService,
    ) {}

    @ApiOperation({ summary: "Проверка работоспособности БД" })
    @Get("/health")
    @HealthCheck()
    public async getHealth() {
        return this.healthCheckService.check([() => this.prismaService.isHealthy()]);
    }
}
