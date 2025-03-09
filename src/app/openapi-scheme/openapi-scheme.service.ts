import { Injectable } from '@nestjs/common';
import { CreateOpenapiSchemeDto } from './dto/create-openapi-scheme.dto';
import { UpdateOpenapiSchemeDto } from './dto/update-openapi-scheme.dto';

@Injectable()
export class OpenapiSchemeService {
  create(createOpenapiSchemeDto: CreateOpenapiSchemeDto) {
    return 'This action adds a new openapiScheme';
  }

  findAll() {
    return `This action returns all openapiScheme`;
  }

  findOne(id: number) {
    return `This action returns a #${id} openapiScheme`;
  }

  update(id: number, updateOpenapiSchemeDto: UpdateOpenapiSchemeDto) {
    return `This action updates a #${id} openapiScheme`;
  }

  remove(id: number) {
    return `This action removes a #${id} openapiScheme`;
  }
}
