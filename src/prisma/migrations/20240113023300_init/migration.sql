/*
  Warnings:

  - You are about to drop the column `token` on the `booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uniqueString]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniqueString` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Booking_token_key` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `token`,
    ADD COLUMN `uniqueString` JSON NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_uniqueString_key` ON `Booking`(`uniqueString`);
