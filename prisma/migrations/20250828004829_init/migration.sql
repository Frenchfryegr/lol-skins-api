-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Champion" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Champion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Skin" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "championId" INTEGER NOT NULL,

    CONSTRAINT "Skin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "public"."User"("password");

-- AddForeignKey
ALTER TABLE "public"."Skin" ADD CONSTRAINT "Skin_championId_fkey" FOREIGN KEY ("championId") REFERENCES "public"."Champion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
