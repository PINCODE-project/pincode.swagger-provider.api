/*
  Warnings:

  - You are about to drop the column `subscription_expires_at` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELED', 'PENDING');

-- AlterTable
ALTER TABLE "microservice" ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "subscription_expires_at";

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "payment_id" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_payment_id_key" ON "subscription"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_user_id_key" ON "subscription"("user_id");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
