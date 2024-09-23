-- Remove or comment this out to avoid creating the table again
-- CREATE TABLE "users" (
--     "id" SERIAL NOT NULL,
--     "clerk_user_id" TEXT NOT NULL,
--     "username" TEXT,
--     "email" TEXT NOT NULL,
--     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,
--     "password" TEXT NOT NULL,

--     CONSTRAINT "users_pkey" PRIMARY KEY ("id")
-- );

-- Remove or comment out the unique index creation as well:
-- CREATE UNIQUE INDEX "users_clerk_user_id_key" ON "users"("clerk_user_id");
-- CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
