/*
  Warnings:

  - You are about to drop the column `userId` on the `telegram_code` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `telegram_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `telegram_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `telegram_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `telegram_code` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `telegram_code` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telegramId` to the `telegram_code` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `telegram_code` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "telegram_account" ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "telegram_code" DROP COLUMN "userId",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "telegramId" INTEGER NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
