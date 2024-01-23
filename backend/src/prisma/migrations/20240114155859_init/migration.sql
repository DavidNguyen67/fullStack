/*
  Warnings:

  - You are about to drop the column `description` on the `clinic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `clinic` DROP COLUMN `description`,
    ADD COLUMN `contentMarkdown_EN` JSON NULL,
    ADD COLUMN `contentMarkdown_VI` JSON NULL,
    ADD COLUMN `descriptionHTML_EN` JSON NULL,
    ADD COLUMN `descriptionHTML_VI` JSON NULL;
