/*
  Warnings:

  - You are about to alter the column `date` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date` on the `schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[emailTest]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailTest` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookings` MODIFY `date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `schedule` MODIFY `date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `emailTest` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_emailTest_key` ON `User`(`emailTest`);
