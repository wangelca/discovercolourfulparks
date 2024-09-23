-- CreateTable
CREATE TABLE "park" (
    "parkId" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(1000),
    "location" VARCHAR(300) NOT NULL,

    CONSTRAINT "park_pkey" PRIMARY KEY ("parkId")
);
