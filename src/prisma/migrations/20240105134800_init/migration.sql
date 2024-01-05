-- CreateTable
CREATE TABLE `Markdown` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contentHTML` JSON NOT NULL,
    `contetnMarkdown` JSON NOT NULL,
    `descript` JSON NULL,
    `doctorId` INTEGER NULL,
    `specialtyId` INTEGER NULL,
    `clinicId` INTEGER NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
