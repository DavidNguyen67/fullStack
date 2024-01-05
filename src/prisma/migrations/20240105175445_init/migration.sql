/*
  Warnings:

  - You are about to drop the column `contetnMarkdown` on the `markdown` table. All the data in the column will be lost.
  - Added the required column `contentMarkdown` to the `Markdown` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `markdown` DROP COLUMN `contetnMarkdown`,
    ADD COLUMN `contentMarkdown` JSON NOT NULL;
