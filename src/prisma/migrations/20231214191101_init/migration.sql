/*
  Warnings:

  - You are about to drop the column `keyRole` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `typeRole` on the `user` table. All the data in the column will be lost.
  - Added the required column `name` to the `Clinic` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `image` on the `clinic` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `files` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Specialty` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `image` on the `specialty` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `clinic` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    DROP COLUMN `image`,
    ADD COLUMN `image` JSON NOT NULL;

-- AlterTable
ALTER TABLE `history` ADD COLUMN `files` JSON NOT NULL;

-- AlterTable
ALTER TABLE `specialty` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    DROP COLUMN `image`,
    ADD COLUMN `image` JSON NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `keyRole`,
    DROP COLUMN `typeRole`,
    ADD COLUMN `image` JSON NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `positionId` VARCHAR(191) NOT NULL DEFAULT 'P0',
    ADD COLUMN `roleId` VARCHAR(191) NOT NULL DEFAULT 'R3';
