-- CreateTable
CREATE TABLE `TopStaff` (
    `TopStaff_id` INTEGER NOT NULL AUTO_INCREMENT,
    `staff_Id` INTEGER NOT NULL,

    UNIQUE INDEX `TopStaff_staff_Id_key`(`staff_Id`),
    PRIMARY KEY (`TopStaff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TopStaff` ADD CONSTRAINT `TopStaff_staff_Id_fkey` FOREIGN KEY (`staff_Id`) REFERENCES `Staff`(`staff_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
