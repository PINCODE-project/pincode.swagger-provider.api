-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('URL', 'TEXT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pendind', 'succeeded', 'waiting_for_capture', 'canceled');

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "recipient_account_id" TEXT NOT NULL,
    "recipient_gateway_id" TEXT NOT NULL,
    "is_test" BOOLEAN NOT NULL DEFAULT false,
    "is_processed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
