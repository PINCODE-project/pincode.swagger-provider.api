-- CreateTable
CREATE TABLE "telegram_account" (
    "id" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "telegram_account_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "telegram_account" ADD CONSTRAINT "telegram_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
