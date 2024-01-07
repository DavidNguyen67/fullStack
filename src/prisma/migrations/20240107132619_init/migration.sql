/*
  Warnings:

  - You are about to drop the column `description` on the `markdown` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `markdown` DROP COLUMN `description`,
    ADD COLUMN `description_EN` JSON NULL,
    ADD COLUMN `description_VI` JSON NULL;
