/*
  Warnings:

  - You are about to alter the column `date` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date` on the `schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `bookings` MODIFY `date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `schedule` MODIFY `date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `typeId` VARCHAR(191) NOT NULL DEFAULT 'R1',
    MODIFY `positionId` VARCHAR(191) NOT NULL DEFAULT 'C1';
