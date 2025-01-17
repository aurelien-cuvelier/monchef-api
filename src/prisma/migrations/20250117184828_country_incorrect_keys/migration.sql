/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `countries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[a2]` on the table `countries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[a3]` on the table `countries` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_country_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "country" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "countries_a2_key" ON "countries"("a2");

-- CreateIndex
CREATE UNIQUE INDEX "countries_a3_key" ON "countries"("a3");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_country_fkey" FOREIGN KEY ("country") REFERENCES "countries"("a3") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_country_fkey" FOREIGN KEY ("country") REFERENCES "countries"("a3") ON DELETE RESTRICT ON UPDATE CASCADE;
