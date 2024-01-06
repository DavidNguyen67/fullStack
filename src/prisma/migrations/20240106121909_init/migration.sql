/*
  Warnings:

  - A unique constraint covering the columns `[doctorId]` on the table `Markdown` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Markdown_doctorId_key` ON `Markdown`(`doctorId`);

-- AddForeignKey
ALTER TABLE `Markdown` ADD CONSTRAINT `Markdown_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
