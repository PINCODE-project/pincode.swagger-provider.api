-- AlterTable
ALTER TABLE "telegram_code" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
