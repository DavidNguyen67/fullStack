-- AlterTable
ALTER TABLE `clinic` MODIFY `image` LONGBLOB NOT NULL;

-- AlterTable
ALTER TABLE `specialty` MODIFY `image` LONGBLOB NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `image` LONGBLOB NULL;
