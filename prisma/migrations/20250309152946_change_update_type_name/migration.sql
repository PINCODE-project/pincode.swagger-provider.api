/*
  Warnings:

  - The values [PAGE_OPEN] on the enum `OpenApiSchemeUpdateType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OpenApiSchemeUpdateType_new" AS ENUM ('INIT', 'WEBHOOK', 'GET_REQUEST', 'MANUAL', 'CLI');
ALTER TABLE "openapi_schemes" ALTER COLUMN "updateType" TYPE "OpenApiSchemeUpdateType_new" USING ("updateType"::text::"OpenApiSchemeUpdateType_new");
ALTER TYPE "OpenApiSchemeUpdateType" RENAME TO "OpenApiSchemeUpdateType_old";
ALTER TYPE "OpenApiSchemeUpdateType_new" RENAME TO "OpenApiSchemeUpdateType";
DROP TYPE "OpenApiSchemeUpdateType_old";
COMMIT;
