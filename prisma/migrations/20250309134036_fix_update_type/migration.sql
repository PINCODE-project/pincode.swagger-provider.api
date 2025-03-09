/*
  Warnings:

  - Changed the type of `updateType` on the `openapi_schemes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OpenApiSchemeUpdateType" AS ENUM ('INIT', 'WEBHOOK', 'PAGE_OPEN', 'MANUAL', 'CLI');

-- AlterTable
ALTER TABLE "openapi_schemes" DROP COLUMN "updateType",
ADD COLUMN     "updateType" "OpenApiSchemeUpdateType" NOT NULL;

-- DropEnum
DROP TYPE "OpenApiSchemeUpdateTupe";
