/*
  Warnings:

  - You are about to drop the column `contentHTML` on the `markdown` table. All the data in the column will be lost.
  - You are about to drop the column `contentMarkdown` on the `markdown` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `markdown` DROP COLUMN `contentHTML`,
    DROP COLUMN `contentMarkdown`,
    ADD COLUMN `contentHTML_EN` JSON NULL,
    ADD COLUMN `contentHTML_VI` JSON NULL,
    ADD COLUMN `contentMarkdown_EN` JSON NULL,
    ADD COLUMN `contentMarkdown_VI` JSON NULL;
