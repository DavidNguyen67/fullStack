-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_patientId_fkey`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_id_fkey` FOREIGN KEY (`id`) REFERENCES `Booking`(`patientId`) ON DELETE RESTRICT ON UPDATE CASCADE;
