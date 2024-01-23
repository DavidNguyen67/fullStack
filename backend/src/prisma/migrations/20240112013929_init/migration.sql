/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Booking_patientId_key` ON `Booking`(`patientId`);
