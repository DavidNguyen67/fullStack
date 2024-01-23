/*
  Warnings:

  - You are about to drop the column `description` on the `specialty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `specialty` DROP COLUMN `description`,
    ADD COLUMN `contentHTML_EN` JSON NULL,
    ADD COLUMN `contentHTML_VI` JSON NULL,
    ADD COLUMN `contentMarkdown_EN` JSON NULL,
    ADD COLUMN `contentMarkdown_VI` JSON NULL,
    ADD COLUMN `description_EN` JSON NULL,
    ADD COLUMN `description_VI` JSON NULL;
