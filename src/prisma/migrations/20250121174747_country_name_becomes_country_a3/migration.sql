/*
  Warnings:

  - You are about to drop the column `country` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `country_name` on the `users` table. All the data in the column will be lost.
  - Added the required column `country_a3` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_a3` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_country_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_country_name_fkey";

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "country",
ADD COLUMN     "country_a3" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "country_name",
ADD COLUMN     "country_a3" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_country_a3_fkey" FOREIGN KEY ("country_a3") REFERENCES "countries"("a3") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_country_a3_fkey" FOREIGN KEY ("country_a3") REFERENCES "countries"("a3") ON DELETE RESTRICT ON UPDATE CASCADE;
