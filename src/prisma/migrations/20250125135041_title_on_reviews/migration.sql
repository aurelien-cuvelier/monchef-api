/*
  Warnings:

  - Added the required column `title` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "title" TEXT NOT NULL;
