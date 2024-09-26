-- AlterTable
ALTER TABLE `imovel` MODIFY `valorIptu` DOUBLE NULL;

-- AlterTable
ALTER TABLE `locatario` MODIFY `dataNascimento` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `proprietario` MODIFY `dataNascimento` DATETIME(3) NULL,
    MODIFY `cpf` VARCHAR(191) NULL,
    MODIFY `rg` VARCHAR(191) NULL,
    MODIFY `orgaoExpedidor` VARCHAR(191) NULL;
