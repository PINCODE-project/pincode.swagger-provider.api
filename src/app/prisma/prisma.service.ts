import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/__generated__";
import { HealthIndicatorResult } from "@nestjs/terminus";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    public async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    public async onModuleDestroy(): Promise<void> {
        await this.$disconnect;
    }

    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            await this.$queryRaw`SELECT 1`;
            return Promise.resolve({
                prisma: {
                    status: "up",
                },
            });
        } catch (e) {
            return Promise.resolve({
                prisma: {
                    status: "down",
                },
            });
        }
    }
}
