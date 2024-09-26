-- CreateTable
CREATE TABLE `Board` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Column` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `boardId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Imovel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoImovelSelecionado` VARCHAR(191) NOT NULL,
    `valorAluguel` DOUBLE NOT NULL,
    `valorIptu` DOUBLE NOT NULL,
    `valorCondominio` DOUBLE NOT NULL,
    `valorGas` DOUBLE NOT NULL,
    `planoSelecionado` VARCHAR(191) NOT NULL,
    `valorMensal` DOUBLE NOT NULL,
    `taxaSetup` DOUBLE NOT NULL,
    `cardId` INTEGER NOT NULL,

    UNIQUE INDEX `Imovel_cardId_key`(`cardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proprietario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoPessoa` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NULL,
    `razaoSocial` VARCHAR(191) NULL,
    `estadoCivil` VARCHAR(191) NOT NULL,
    `cpfConjuge` VARCHAR(191) NULL,
    `nomeCompleto` VARCHAR(191) NOT NULL,
    `nomeCompletoConjuge` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `nacionalidade` VARCHAR(191) NOT NULL,
    `naturalidade` VARCHAR(191) NOT NULL,
    `dataNascimento` DATETIME(3) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `rg` VARCHAR(191) NOT NULL,
    `orgaoExpedidor` VARCHAR(191) NOT NULL,
    `emailConjuge` VARCHAR(191) NULL,
    `telefoneConjuge` VARCHAR(191) NULL,
    `nacionalidadeConjuge` VARCHAR(191) NULL,
    `naturalidadeConjuge` VARCHAR(191) NULL,
    `dataNascimentoConjuge` DATETIME(3) NULL,
    `rgConjuge` VARCHAR(191) NULL,
    `orgaoExpedidorConjuge` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `complemento` VARCHAR(191) NULL,
    `anexoCpfRgMotorista` VARCHAR(191) NULL,
    `anexoCpfRgMotoristaConj` VARCHAR(191) NULL,
    `anexoEstadoCivil` VARCHAR(191) NULL,
    `anexoResidencia` VARCHAR(191) NULL,
    `anexoContratoSocial` VARCHAR(191) NULL,
    `cardId` INTEGER NOT NULL,

    UNIQUE INDEX `Proprietario_cardId_key`(`cardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImovelDetalhes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `finalidade` VARCHAR(191) NOT NULL,
    `tipoImovel` VARCHAR(191) NOT NULL,
    `valorAluguel` DOUBLE NOT NULL,
    `valorCondominio` DOUBLE NOT NULL,
    `valorIptu` DOUBLE NULL,
    `valorAgua` DOUBLE NULL,
    `valorGas` DOUBLE NULL,
    `administradorNome` VARCHAR(191) NULL,
    `administradorTelefone` VARCHAR(191) NULL,
    `cepImovel` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `complemento` VARCHAR(191) NULL,
    `anexoCondominio` VARCHAR(191) NULL,
    `anexoIptu` VARCHAR(191) NULL,
    `anexoAgua` VARCHAR(191) NULL,
    `anexoLuz` VARCHAR(191) NULL,
    `anexoEscritura` VARCHAR(191) NULL,
    `cardId` INTEGER NOT NULL,

    UNIQUE INDEX `ImovelDetalhes_cardId_key`(`cardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Locatario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoPessoa` VARCHAR(191) NOT NULL,
    `nomeCompleto` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `nacionalidade` VARCHAR(191) NOT NULL,
    `naturalidade` VARCHAR(191) NOT NULL,
    `estadoCivil` VARCHAR(191) NOT NULL,
    `dataNascimento` DATETIME(3) NOT NULL,
    `cpf` VARCHAR(191) NULL,
    `rg` VARCHAR(191) NULL,
    `orgaoExpedidor` VARCHAR(191) NULL,
    `cnpj` VARCHAR(191) NULL,
    `razaoSocial` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `complemento` VARCHAR(191) NULL,
    `anexoCpfRgMotoristaLocatario` VARCHAR(191) NULL,
    `anexoEstadoCivilLocatario` VARCHAR(191) NULL,
    `anexoResidenciaLocatario` VARCHAR(191) NULL,
    `anexoContratoSocialLocatario` VARCHAR(191) NULL,
    `anexoUltimoBalancoLocatario` VARCHAR(191) NULL,
    `cardId` INTEGER NOT NULL,

    UNIQUE INDEX `Locatario_cardId_key`(`cardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Card` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `columnId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Anexo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cardId` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Column` ADD CONSTRAINT `Column_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Imovel` ADD CONSTRAINT `Imovel_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proprietario` ADD CONSTRAINT `Proprietario_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImovelDetalhes` ADD CONSTRAINT `ImovelDetalhes_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Locatario` ADD CONSTRAINT `Locatario_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_columnId_fkey` FOREIGN KEY (`columnId`) REFERENCES `Column`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Anexo` ADD CONSTRAINT `Anexo_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
