-- CreateTable
CREATE TABLE `Events` (
    `events_id` INTEGER NOT NULL AUTO_INCREMENT,
    `events_name` VARCHAR(191) NOT NULL,
    `image` LONGBLOB NULL,

    PRIMARY KEY (`events_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
