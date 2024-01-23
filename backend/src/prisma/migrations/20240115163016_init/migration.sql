-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_timeType_fkey` FOREIGN KEY (`timeType`) REFERENCES `AllCode`(`keyMap`) ON DELETE RESTRICT ON UPDATE CASCADE;
