-- CreateEnum
CREATE TYPE "Chef_ranks" AS ENUM ('APPRENTICE_CHEF', 'SOUS_CHEF', 'EXECUTIVE_CHEF', 'HEAD_CHEF', 'MICHELIN_STARRED_CHEF', 'CHEF_PATRON', 'MASTER_CHEF', 'CULINARY_DIRECTORY');

-- CreateEnum
CREATE TYPE "Meal_type" AS ENUM ('MAIN_DISH', 'SIDE_DISH', 'DESSERT');

-- CreateEnum
CREATE TYPE "Tags" AS ENUM ('VEGAN', 'VEGETARIAN', 'GLUTEN_FREE', 'DAIRY_FREE', 'LOW_CARB', 'PALEO', 'KOSHER', 'HALAL');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEADIUM', 'HARD');

-- CreateEnum
CREATE TYPE "Units" AS ENUM ('GRAM', 'KILOGRAM', 'MILILITER', 'LITER', 'TABLESPOON', 'TEASPOON', 'PIECE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "country" INTEGER NOT NULL,
    "twitter" TEXT,
    "discord" TEXT,
    "chef_rank" "Chef_ranks" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "images" TEXT[],
    "duration" INTEGER NOT NULL,
    "diffulty" "Difficulty" NOT NULL,
    "recipe" TEXT NOT NULL,
    "meal_role" "Meal_type" NOT NULL,
    "tags" "Tags" NOT NULL,
    "overall_rating" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_items" (
    "id" SERIAL NOT NULL,
    "ingedient_id" INTEGER NOT NULL,
    "unit" "Units" NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "recipe_id" INTEGER NOT NULL,

    CONSTRAINT "recipe_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_by" INTEGER NOT NULL,
    "reviewed_recipe" INTEGER NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "a2" TEXT NOT NULL,
    "a3" TEXT NOT NULL,
    "flag" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_address_key" ON "users"("address");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_id_key" ON "recipes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_items_id_key" ON "recipe_items"("id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_id_key" ON "reviews"("id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_country_fkey" FOREIGN KEY ("country") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_items" ADD CONSTRAINT "recipe_items_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_items" ADD CONSTRAINT "recipe_items_ingedient_id_fkey" FOREIGN KEY ("ingedient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewed_recipe_fkey" FOREIGN KEY ("reviewed_recipe") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
