/*
  Warnings:

  - Added the required column `keyRole` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeRole` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `keyRole` VARCHAR(191) NOT NULL,
    ADD COLUMN `typeRole` VARCHAR(191) NOT NULL,
    MODIFY `gender` BOOLEAN NOT NULL DEFAULT true;
