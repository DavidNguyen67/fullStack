/*
  Warnings:

  - You are about to drop the column `descript` on the `markdown` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `markdown` DROP COLUMN `descript`,
    ADD COLUMN `description` JSON NULL;
