import { PartialType } from "@nestjs/swagger";
import { CreateMicroserviceDto } from "./create-microservice.dto";

export class UpdateMicroserviceDto extends PartialType(CreateMicroserviceDto) {}
