-- AddForeignKey
ALTER TABLE `Doctor_info` ADD CONSTRAINT `Doctor_info_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor_info` ADD CONSTRAINT `Doctor_info_priceId_fkey` FOREIGN KEY (`priceId`) REFERENCES `AllCode`(`keyMap`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor_info` ADD CONSTRAINT `Doctor_info_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `AllCode`(`keyMap`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor_info` ADD CONSTRAINT `Doctor_info_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `AllCode`(`keyMap`) ON DELETE RESTRICT ON UPDATE CASCADE;
