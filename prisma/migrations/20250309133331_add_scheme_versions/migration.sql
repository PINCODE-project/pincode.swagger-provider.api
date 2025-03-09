/*
  Warnings:

  - You are about to drop the column `cache` on the `microservices` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `microservices` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OpenApiSchemeUpdateTupe" AS ENUM ('WEBHOOK', 'PAGE_OPEN', 'MANUAL', 'CLI');

-- AlterTable
ALTER TABLE "microservices" DROP COLUMN "cache",
DROP COLUMN "content";

-- CreateTable
CREATE TABLE "openapi_schemes" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" TEXT,
    "cache" TEXT,
    "updateType" "OpenApiSchemeUpdateTupe" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "microservice_id" TEXT,

    CONSTRAINT "openapi_schemes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "openapi_schemes" ADD CONSTRAINT "openapi_schemes_microservice_id_fkey" FOREIGN KEY ("microservice_id") REFERENCES "microservices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
