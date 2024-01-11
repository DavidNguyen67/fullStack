/*
  Warnings:

  - You are about to drop the column `provindeId` on the `doctor_info` table. All the data in the column will be lost.
  - Added the required column `provinceId` to the `Doctor_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `doctor_info` DROP COLUMN `provindeId`,
    ADD COLUMN `provinceId` VARCHAR(191) NOT NULL;
