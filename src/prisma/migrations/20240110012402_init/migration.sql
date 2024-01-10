-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_timeType_fkey` FOREIGN KEY (`timeType`) REFERENCES `AllCode`(`keyMap`) ON DELETE RESTRICT ON UPDATE CASCADE;
