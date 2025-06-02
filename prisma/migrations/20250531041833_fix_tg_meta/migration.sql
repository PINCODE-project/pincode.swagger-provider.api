/*
  Warnings:

  - You are about to drop the column `first_name` on the `telegram_account` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `telegram_account` table. All the data in the column will be lost.
  - You are about to drop the column `telegramId` on the `telegram_code` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `telegram_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `telegram_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telegram_id` to the `telegram_code` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "telegram_account" DROP COLUMN "first_name",
DROP COLUMN "last_name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "telegram_code" DROP COLUMN "telegramId",
ADD COLUMN     "telegram_id" INTEGER NOT NULL;
