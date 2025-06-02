-- CreateTable
CREATE TABLE "telegram_code" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "telegram_code_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "telegram_code" ADD CONSTRAINT "telegram_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
