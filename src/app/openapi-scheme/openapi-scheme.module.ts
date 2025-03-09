import { Module } from '@nestjs/common';
import { OpenapiSchemeService } from './openapi-scheme.service';
import { OpenapiSchemeController } from './openapi-scheme.controller';

@Module({
  controllers: [OpenapiSchemeController],
  providers: [OpenapiSchemeService],
})
export class OpenapiSchemeModule {}
