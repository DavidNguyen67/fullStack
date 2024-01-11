/*
  Warnings:

  - A unique constraint covering the columns `[doctorId]` on the table `Doctor_info` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Doctor_info_doctorId_key` ON `Doctor_info`(`doctorId`);
