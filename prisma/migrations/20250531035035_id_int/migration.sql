/*
  Warnings:

  - Changed the type of `telegramId` on the `telegram_account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `telegram_code` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "telegram_account" DROP COLUMN "telegramId",
ADD COLUMN     "telegramId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "telegram_code" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;
