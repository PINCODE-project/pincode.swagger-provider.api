/*
  Warnings:

  - You are about to drop the column `user_id` on the `telegram_code` table. All the data in the column will be lost.
  - Added the required column `userId` to the `telegram_code` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "telegram_code" DROP CONSTRAINT "telegram_code_user_id_fkey";

-- AlterTable
ALTER TABLE "telegram_code" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;
