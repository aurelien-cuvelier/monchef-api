/*
  Warnings:

  - You are about to alter the column `quantity` on the `recipe_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `overall_rating` on the `recipes` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "recipe_items" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "recipes" ALTER COLUMN "overall_rating" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0;
