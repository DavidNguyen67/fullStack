/*
  Warnings:

  - You are about to alter the column `date` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date` on the `schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `bookings` MODIFY `date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `schedule` MODIFY `date` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `TestFileUpload` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avatar` LONGBLOB NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
