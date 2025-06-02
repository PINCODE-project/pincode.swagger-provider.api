-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "recipient_account_id" DROP NOT NULL,
ALTER COLUMN "recipient_gateway_id" DROP NOT NULL,
ALTER COLUMN "is_test" DROP NOT NULL;
