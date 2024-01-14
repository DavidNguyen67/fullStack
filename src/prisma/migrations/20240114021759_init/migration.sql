-- AddForeignKey
ALTER TABLE `Doctor_info` ADD CONSTRAINT `Doctor_info_clinicId_fkey` FOREIGN KEY (`clinicId`) REFERENCES `Clinic`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor_info` ADD CONSTRAINT `Doctor_info_specialtyId_fkey` FOREIGN KEY (`specialtyId`) REFERENCES `Specialty`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
