/*
  Warnings:

  - You are about to drop the column `key` on the `allcode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[keyMap]` on the table `AllCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `keyMap` to the `AllCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `AllCode_key_key` ON `allcode`;

-- AlterTable
ALTER TABLE `allcode` DROP COLUMN `key`,
    ADD COLUMN `keyMap` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AllCode_keyMap_key` ON `AllCode`(`keyMap`);
