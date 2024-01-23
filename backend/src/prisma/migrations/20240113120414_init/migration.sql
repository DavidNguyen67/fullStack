/*
  Warnings:

  - You are about to drop the column `contentHTML_EN` on the `specialty` table. All the data in the column will be lost.
  - You are about to drop the column `contentHTML_VI` on the `specialty` table. All the data in the column will be lost.
  - You are about to drop the column `description_EN` on the `specialty` table. All the data in the column will be lost.
  - You are about to drop the column `description_VI` on the `specialty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `specialty` DROP COLUMN `contentHTML_EN`,
    DROP COLUMN `contentHTML_VI`,
    DROP COLUMN `description_EN`,
    DROP COLUMN `description_VI`,
    ADD COLUMN `descriptionHTML_EN` JSON NULL,
    ADD COLUMN `descriptionHTML_VI` JSON NULL;
