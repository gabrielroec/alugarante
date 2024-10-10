import { Request, Response } from "express";
import { prisma } from "../prismaClient"; // Importação do Prisma
import upload from "../middlewares/multer";
import fs from "fs/promises"; // Para operações de sistema de arquivos
import path from "path"; // Para manipulação de caminhos de arquivos
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRequest } from "../middlewares/auth";

// Tipagem de parâmetros para o Request com params
interface Params {
  boardId?: string;
  columnId?: string;
}

// Função para pegar todos os boards
export const getBoards = async (req: Request, res: Response) => {
  try {
    const boards = await prisma.board.findMany({
      include: {
        columns: true, // Inclui as colunas associadas a cada board
      },
    });
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar boards" });
  }
};

// Função para pegar um board específico pelo ID
export const getBoardById = async (req: Request<Params>, res: Response) => {
  const { boardId } = req.params;

  if (!boardId) {
    return res.status(400).json({ message: "ID do board não fornecido" });
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id: parseInt(boardId) },
      include: {
        columns: {
          include: {
            cards: {
              include: {
                proprietario: true,
                imovel: true,
                locatario: true,
                imovelDetalhes: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ message: "Board não encontrado" });
    }

    return res.status(200).json(board);
  } catch (error) {
    console.error("Erro ao buscar board:", error);
    return res.status(500).json({ message: "Erro ao buscar board" });
  }
};

// Função para pegar os cards de uma coluna específica com todas as informações associadas
export const getCardsByColumn = async (req: Request<Params>, res: Response) => {
  const { columnId } = req.params;

  if (!columnId) {
    return res.status(400).json({ message: "ID da coluna não fornecido" });
  }

  try {
    const cards = await prisma.card.findMany({
      where: { columnId: parseInt(columnId) },
      include: {
        proprietario: true, // Inclui os dados do proprietário
        imovel: true, // Inclui os dados do imóvel
        locatario: true, // Inclui os dados do locatário
        imovelDetalhes: true, // Inclui os detalhes do imóvel
      },
    });

    if (!cards.length) {
      return res.status(404).json({ message: "Nenhum card encontrado para esta coluna" });
    }

    return res.status(200).json(cards);
  } catch (error) {
    console.error("Erro ao buscar cards:", error);
    return res.status(500).json({ message: "Erro ao buscar cards" });
  }
};

// Função para pegar todas as colunas e seus cards de um board específico
export const getColumnsAndCardsByBoardId = async (req: Request<Params>, res: Response) => {
  const { boardId } = req.params;

  if (!boardId) {
    return res.status(400).json({ message: "ID do board não fornecido" });
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id: parseInt(boardId) },
      include: {
        columns: {
          include: {
            cards: {
              include: {
                proprietario: true,
                imovel: true,
                locatario: true,
                imovelDetalhes: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ message: "Board não encontrado" });
    }

    return res.status(200).json(board);
  } catch (error) {
    console.error("Erro ao buscar colunas e cards:", error);
    return res.status(500).json({ message: "Erro ao buscar colunas e cards" });
  }
};

// Função para atualizar o columnId de um card
export const moveCardToColumn = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { targetColumnId } = req.body;

  try {
    // Atualizar o card com o novo columnId
    const updatedCard = await prisma.card.update({
      where: { id: parseInt(cardId) },
      data: {
        columnId: parseInt(targetColumnId),
      },
    });

    res.status(200).json(updatedCard); // Retorna o card atualizado
  } catch (error) {
    console.error("Erro ao mover card:", error);
    res.status(500).json({ message: "Erro ao mover card" });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const board = await prisma.board.findFirst({
      include: { columns: true },
    });

    if (!board || board.columns.length === 0) {
      return res.status(400).json({ message: "Board ou colunas não encontradas." });
    }

    const primeiraColuna = board.columns[0];

    const novoCard = await prisma.card.create({
      data: {
        columnId: primeiraColuna.id, // Associar o card à primeira coluna
      },
    });

    // Retorna o cardId para ser usado nos próximos formulários
    return res.status(200).json({ cardId: novoCard.id });
  } catch (error) {
    console.error("Erro ao criar card:", error);
    return res.status(500).json({ message: "Erro ao criar card" });
  }
};

export const saveImovelToCard = async (req: Request, res: Response) => {
  const { cardId, tipoImovelSelecionado, valorAluguel, valorIptu, valorCondominio, valorGas, planoSelecionado, valorMensal, taxaSetup } =
    req.body;

  try {
    const imovel = await prisma.imovel.create({
      data: {
        tipoImovelSelecionado,
        valorAluguel: parseFloat(valorAluguel),
        valorIptu: parseFloat(valorIptu),
        valorCondominio: parseFloat(valorCondominio),
        valorGas: parseFloat(valorGas),
        planoSelecionado,
        valorMensal: parseFloat(valorMensal),
        taxaSetup: parseFloat(taxaSetup),
        card: {
          connect: { id: cardId }, // Conectando o Imóvel ao Card
        },
      },
    });

    res.status(200).json(imovel);
  } catch (error) {
    console.error("Erro ao salvar imóvel:", error);
    res.status(500).json({ message: "Erro ao salvar imóvel" });
  }
};

export const saveProprietarioToCard = async (req: Request, res: Response) => {
  const {
    cardId,
    tipoPessoa,
    cnpj,
    razaoSocial,
    estadoCivil,
    cpfConjuge,
    nomeCompleto,
    nomeCompletoConjuge,
    email,
    telefone,
    nacionalidade,
    naturalidade,
    dataNascimento,
    cpf,
    rg,
    orgaoExpedidor,
    emailConjuge,
    telefoneConjuge,
    nacionalidadeConjuge,
    naturalidadeConjuge,
    dataNascimentoConjuge,
    rgConjuge,
    orgaoExpedidorConjuge,
    cep,
    estado,
    bairro,
    endereco,
    numero,
    complemento,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  console.log("CardId:", cardId);
  console.log("Dados do Proprietário:", req.body);
  console.log("Arquivos recebidos:", files);
  try {
    const proprietario = await prisma.proprietario.create({
      data: {
        tipoPessoa,
        cnpj,
        razaoSocial,
        estadoCivil,
        cpfConjuge,
        nomeCompleto,
        nomeCompletoConjuge,
        email,
        telefone,
        nacionalidade,
        naturalidade,
        dataNascimento: new Date(dataNascimento),
        cpf,
        rg,
        orgaoExpedidor,
        emailConjuge,
        telefoneConjuge,
        nacionalidadeConjuge,
        naturalidadeConjuge,
        dataNascimentoConjuge: dataNascimentoConjuge ? new Date(dataNascimentoConjuge) : null,
        rgConjuge,
        orgaoExpedidorConjuge,
        cep,
        estado,
        bairro,
        endereco,
        numero,
        complemento,
        anexoCpfRgMotorista: files.anexoCpfRgMotorista ? files.anexoCpfRgMotorista[0].path : null,
        anexoCpfRgMotoristaConj: files.anexoCpfRgMotoristaConj ? files.anexoCpfRgMotoristaConj[0].path : null,
        anexoEstadoCivil: files.anexoEstadoCivil ? files.anexoEstadoCivil[0].path : null,
        anexoResidencia: files.anexoResidencia ? files.anexoResidencia[0].path : null,
        anexoContratoSocial: files.anexoContratoSocial ? files.anexoContratoSocial[0].path : null,
        card: {
          connect: { id: parseInt(cardId) }, // Converte cardId para inteiro
        },
      },
    });

    res.status(200).json(proprietario);
  } catch (error) {
    console.error("Erro ao salvar proprietário:", error);
    res.status(500).json({ message: "Erro ao salvar proprietário" });
  }
};

export const saveImovelDetalhesToCard = async (req: Request, res: Response) => {
  const {
    cardId,
    finalidade,
    tipoImovel,
    valorAluguel,
    valorCondominio,
    valorIptu,
    valorAgua,
    valorGas,
    administradorNome,
    administradorTelefone,
    cepImovel,
    cidade,
    estado,
    bairro,
    endereco,
    numero,
    complemento,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    // Converte cardId para número antes de usá-lo
    const imovelDetalhes = await prisma.imovelDetalhes.create({
      data: {
        finalidade,
        tipoImovel,
        valorAluguel: parseFloat(valorAluguel),
        valorCondominio: parseFloat(valorCondominio),
        valorIptu: valorIptu ? parseFloat(valorIptu) : null,
        valorAgua: valorAgua ? parseFloat(valorAgua) : null,
        valorGas: valorGas ? parseFloat(valorGas) : null,
        administradorNome,
        administradorTelefone,
        cepImovel,
        cidade,
        estado,
        bairro,
        endereco,
        numero,
        complemento,
        anexoCondominio: files.anexoCondominio ? files.anexoCondominio[0].path : null,
        anexoIptu: files.anexoIptu ? files.anexoIptu[0].path : null,
        anexoAgua: files.anexoAgua ? files.anexoAgua[0].path : null,
        anexoLuz: files.anexoLuz ? files.anexoLuz[0].path : null,
        anexoEscritura: files.anexoEscritura ? files.anexoEscritura[0].path : null,
        card: {
          connect: { id: parseInt(cardId) }, // Certifique-se de converter fgo cardId para inteiro
        },
      },
    });

    res.status(200).json(imovelDetalhes);
  } catch (error) {
    console.error("Erro ao salvar detalhes do imóvel:", error);
    res.status(500).json({ message: "Erro ao salvar detalhes do imóvel" });
  }
};

export const saveLocatarioToCard = async (req: Request, res: Response) => {
  const {
    cardId,
    tipoPessoa,
    nomeCompleto,
    email,
    telefone,
    nacionalidade,
    naturalidade,
    estadoCivil,
    dataNascimento,
    cpf,
    rg,
    orgaoExpedidor,
    cnpj,
    razaoSocial,
    cep,
    estado,
    bairro,
    endereco,
    numero,
    complemento,
    cidade,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    // Parse da data de nascimento
    const parsedDataNascimento = dataNascimento && !isNaN(Date.parse(dataNascimento)) ? new Date(dataNascimento) : null;

    const locatario = await prisma.locatario.create({
      data: {
        nomeCompleto,
        email,
        telefone,
        nacionalidade,
        naturalidade,
        estadoCivil,
        dataNascimento: parsedDataNascimento,
        cpf: tipoPessoa === "Física" ? cpf : null,
        rg: tipoPessoa === "Física" ? rg : null,
        orgaoExpedidor: tipoPessoa === "Física" ? orgaoExpedidor : null,
        cnpj: tipoPessoa === "Jurídica" ? cnpj : null,
        razaoSocial: tipoPessoa === "Jurídica" ? razaoSocial : null,
        cep,
        estado,
        bairro,
        endereco,
        numero,
        complemento,
        anexoCpfRgMotoristaLocatario: files.anexoCpfRgMotoristaLocatario ? files.anexoCpfRgMotoristaLocatario[0].path : null,
        anexoEstadoCivilLocatario: files.anexoEstadoCivilLocatario ? files.anexoEstadoCivilLocatario[0].path : null,
        anexoResidenciaLocatario: files.anexoResidenciaLocatario ? files.anexoResidenciaLocatario[0].path : null,
        anexoContratoSocialLocatario: files.anexoContratoSocialLocatario ? files.anexoContratoSocialLocatario[0].path : null,
        anexoUltimoBalancoLocatario: files.anexoUltimoBalancoLocatario ? files.anexoUltimoBalancoLocatario[0].path : null,
        card: {
          connect: {
            id: parseInt(cardId),
          },
        },
        tipoPessoa,
      },
    });

    res.status(200).json(locatario);
  } catch (error) {
    console.error("Erro ao salvar locatário:", error);
    res.status(500).json({ message: "Erro ao salvar locatário" });
  }
};

// Função para atualizar o nome da coluna
export const updateColumnName = async (req: Request, res: Response) => {
  const { columnId } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nome da coluna não fornecido" });
  }
  console.log(columnId);
  console.log(name);
  try {
    const updatedColumn = await prisma.column.update({
      where: { id: parseInt(columnId) },
      data: { name },
    });

    res.status(200).json(updatedColumn);
  } catch (error) {
    console.error("Erro ao atualizar nome da coluna:", error);
    res.status(500).json({ message: "Erro ao atualizar nome da coluna" });
  }
};

// Função para pegar os dados do imóvel de um card específico
export const getImovelByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const imovel = await prisma.imovel.findUnique({
      where: { cardId: parseInt(cardId) },
    });

    if (!imovel) {
      return res.status(404).json({ message: "Imóvel não encontrado para este card" });
    }

    res.status(200).json(imovel);
  } catch (error) {
    console.error("Erro ao buscar imóvel:", error);
    res.status(500).json({ message: "Erro ao buscar imóvel" });
  }
};

// Função para editar as informações do imóvel
export const updateImovelByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { tipoImovelSelecionado, valorAluguel, valorIptu, valorCondominio, valorGas, planoSelecionado, valorMensal, taxaSetup } = req.body;

  try {
    const updatedImovel = await prisma.imovel.update({
      where: { cardId: parseInt(cardId) },
      data: {
        tipoImovelSelecionado,
        valorAluguel: parseFloat(valorAluguel),
        valorIptu: parseFloat(valorIptu),
        valorCondominio: parseFloat(valorCondominio),
        valorGas: parseFloat(valorGas),
        planoSelecionado,
        valorMensal: parseFloat(valorMensal),
        taxaSetup: parseFloat(taxaSetup),
      },
    });

    res.status(200).json(updatedImovel);
  } catch (error) {
    console.error("Erro ao atualizar imóvel:", error);
    res.status(500).json({ message: "Erro ao atualizar imóvel" });
  }
};

// Função para pegar os detalhes do imóvel de um card específico
export const getImovelDetalhesByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const imovelDetalhes = await prisma.imovelDetalhes.findUnique({
      where: { cardId: parseInt(cardId) },
    });

    if (!imovelDetalhes) {
      return res.status(404).json({ message: "Detalhes do Imóvel não encontrados para este card" });
    }

    res.status(200).json(imovelDetalhes);
  } catch (error) {
    console.error("Erro ao buscar detalhes do imóvel:", error);
    res.status(500).json({ message: "Erro ao buscar detalhes do imóvel" });
  }
};

export const updateImovelDetalhesByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const {
    finalidade,
    tipoImovel,
    valorAluguel,
    valorCondominio,
    valorIptu,
    valorAgua,
    valorGas,
    administradorNome,
    administradorTelefone,
    cepImovel,
    cidade,
    estado,
    bairro,
    endereco,
    numero,
    complemento,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    // Primeiro, recuperamos os detalhes existentes do imóvel para preservar os arquivos existentes
    const existingImovelDetalhes = await prisma.imovelDetalhes.findUnique({
      where: { cardId: parseInt(cardId) },
    });

    if (!existingImovelDetalhes) {
      return res.status(404).json({ message: "Detalhes do Imóvel não encontrados para este card" });
    }

    const updatedImovelDetalhes = await prisma.imovelDetalhes.update({
      where: { cardId: parseInt(cardId) },
      data: {
        finalidade,
        tipoImovel,
        valorAluguel: parseFloat(valorAluguel),
        valorCondominio: parseFloat(valorCondominio),
        valorIptu: valorIptu ? parseFloat(valorIptu) : existingImovelDetalhes.valorIptu, // Preserva o valor atual se não for enviado
        valorAgua: valorAgua ? parseFloat(valorAgua) : existingImovelDetalhes.valorAgua, // Preserva o valor atual se não for enviado
        valorGas: parseFloat(valorGas),
        administradorNome,
        administradorTelefone,
        cepImovel,
        cidade,
        estado,
        bairro,
        endereco,
        numero,
        complemento,
        anexoCondominio: files.anexoCondominio ? files.anexoCondominio[0].path : existingImovelDetalhes.anexoCondominio, // Preserva o anexo atual se não for enviado
        anexoIptu: files.anexoIptu ? files.anexoIptu[0].path : existingImovelDetalhes.anexoIptu, // Preserva o anexo atual
        anexoAgua: files.anexoAgua ? files.anexoAgua[0].path : existingImovelDetalhes.anexoAgua, // Preserva o anexo atual
        anexoLuz: files.anexoLuz ? files.anexoLuz[0].path : existingImovelDetalhes.anexoLuz, // Preserva o anexo atual
        anexoEscritura: files.anexoEscritura ? files.anexoEscritura[0].path : existingImovelDetalhes.anexoEscritura, // Preserva o anexo atual
      },
    });

    res.status(200).json(updatedImovelDetalhes);
  } catch (error) {
    console.error("Erro ao atualizar detalhes do imóvel:", error);
    res.status(500).json({ message: "Erro ao atualizar detalhes do imóvel" });
  }
};

export const getProprietarioByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const proprietario = await prisma.proprietario.findUnique({
      where: { cardId: parseInt(cardId) },
    });

    if (!proprietario) {
      return res.status(404).json({ message: "Proprietário não encontrado para este card" });
    }

    res.status(200).json(proprietario);
  } catch (error) {
    console.error("Erro ao buscar proprietário:", error);
    res.status(500).json({ message: "Erro ao buscar proprietário" });
  }
};

export const updateProprietarioByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const {
    tipoPessoa,
    cnpj,
    razaoSocial,
    estadoCivil,
    cpfConjuge,
    nomeCompleto,
    nomeCompletoConjuge,
    email,
    telefone,
    nacionalidade,
    naturalidade,
    dataNascimento,
    cpf,
    rg,
    orgaoExpedidor,
    emailConjuge,
    telefoneConjuge,
    nacionalidadeConjuge,
    naturalidadeConjuge,
    dataNascimentoConjuge,
    rgConjuge,
    orgaoExpedidorConjuge,
    cep,
    estado,
    bairro,
    endereco,
    numero,
    complemento,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    // Primeiro, recuperamos o proprietário existente para preservar os arquivos atuais
    const existingProprietario = await prisma.proprietario.findUnique({
      where: { cardId: parseInt(cardId) },
    });

    if (!existingProprietario) {
      return res.status(404).json({ message: "Proprietário não encontrado para este card" });
    }

    const updatedProprietario = await prisma.proprietario.update({
      where: { cardId: parseInt(cardId) },
      data: {
        tipoPessoa,
        cnpj,
        razaoSocial,
        estadoCivil,
        cpfConjuge,
        nomeCompleto,
        nomeCompletoConjuge,
        email,
        telefone,
        nacionalidade,
        naturalidade,
        dataNascimento: new Date(dataNascimento),
        cpf,
        rg,
        orgaoExpedidor,
        emailConjuge,
        telefoneConjuge,
        nacionalidadeConjuge,
        naturalidadeConjuge,
        dataNascimentoConjuge: dataNascimentoConjuge ? new Date(dataNascimentoConjuge) : existingProprietario.dataNascimentoConjuge,
        rgConjuge,
        orgaoExpedidorConjuge,
        cep,
        estado,
        bairro,
        endereco,
        numero,
        complemento,
        anexoCpfRgMotorista: files.anexoCpfRgMotorista ? files.anexoCpfRgMotorista[0].path : existingProprietario.anexoCpfRgMotorista,
        anexoCpfRgMotoristaConj: files.anexoCpfRgMotoristaConj
          ? files.anexoCpfRgMotoristaConj[0].path
          : existingProprietario.anexoCpfRgMotoristaConj,
        anexoEstadoCivil: files.anexoEstadoCivil ? files.anexoEstadoCivil[0].path : existingProprietario.anexoEstadoCivil,
        anexoResidencia: files.anexoResidencia ? files.anexoResidencia[0].path : existingProprietario.anexoResidencia,
        anexoContratoSocial: files.anexoContratoSocial ? files.anexoContratoSocial[0].path : existingProprietario.anexoContratoSocial,
      },
    });

    res.status(200).json(updatedProprietario);
  } catch (error) {
    console.error("Erro ao atualizar proprietário:", error);
    res.status(500).json({ message: "Erro ao atualizar proprietário" });
  }
};

export const moveCardToBoard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { targetBoardId } = req.body;

  try {
    // Encontre a primeira coluna do board de destino
    const targetBoard = await prisma.board.findUnique({
      where: { id: parseInt(targetBoardId) },
      include: { columns: { orderBy: { id: "asc" } } },
    });

    if (!targetBoard || targetBoard.columns.length === 0) {
      return res.status(400).json({ message: "Board ou colunas não encontradas." });
    }

    const firstColumn = targetBoard.columns[0];

    // Atualize o card com o novo columnId da primeira coluna do board de destino
    const updatedCard = await prisma.card.update({
      where: { id: parseInt(cardId) },
      data: {
        columnId: firstColumn.id,
      },
    });

    res.status(200).json(updatedCard);
  } catch (error) {
    console.error("Erro ao mover card para outro board:", error);
    res.status(500).json({ message: "Erro ao mover card para outro board" });
  }
};

export const createColumn = async (req: Request, res: Response) => {
  const { boardId } = req.params;
  const { name } = req.body;

  if (!boardId || !name) {
    return res.status(400).json({ message: "ID do board e nome da coluna são necessários." });
  }

  try {
    const newColumn = await prisma.column.create({
      data: {
        name,
        board: {
          connect: { id: parseInt(boardId) },
        },
      },
      include: {
        cards: true,
      },
    });

    return res.status(201).json(newColumn);
  } catch (error) {
    console.error("Erro ao criar coluna:", error);
    return res.status(500).json({ message: "Erro ao criar coluna" });
  }
};

export const getLocatarioByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const locatario = await prisma.locatario.findUnique({
      where: { cardId: parseInt(cardId) },
    });

    if (!locatario) {
      return res.status(404).json({ message: "Locatário não encontrado para este card" });
    }

    res.status(200).json(locatario);
  } catch (error) {
    console.error("Erro ao buscar locatário:", error);
    res.status(500).json({ message: "Erro ao buscar locatário" });
  }
};

export const updateLocatarioByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const {
    tipoPessoa,
    nomeCompleto,
    email,
    telefone,
    nacionalidade,
    naturalidade,
    estadoCivil,
    dataNascimento,
    cpf,
    rg,
    orgaoExpedidor,
    cnpj,
    razaoSocial,
    cep,
    estado,
    bairro,
    endereco,
    numero,
    complemento,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    // Verifica se o locatário existe
    const existingLocatario = await prisma.locatario.findUnique({
      where: { cardId: parseInt(cardId) },
    });

    if (!existingLocatario) {
      return res.status(404).json({ message: "Locatário não encontrado para este card" });
    }

    // Prepara os dados para atualização
    const updateData: any = {
      tipoPessoa,
      nomeCompleto,
      email,
      telefone,
      nacionalidade,
      naturalidade,
      estadoCivil,
      dataNascimento: dataNascimento ? new Date(dataNascimento) : existingLocatario.dataNascimento,
      cpf: tipoPessoa === "Física" ? cpf : null,
      rg: tipoPessoa === "Física" ? rg : null,
      orgaoExpedidor: tipoPessoa === "Física" ? orgaoExpedidor : null,
      cnpj: tipoPessoa === "Jurídica" ? cnpj : null,
      razaoSocial: tipoPessoa === "Jurídica" ? razaoSocial : null,
      cep,
      estado,
      bairro,
      endereco,
      numero,
      complemento,
    };

    // Atualiza os anexos se existirem
    if (files) {
      if (files.anexoCpfRgMotoristaLocatario) {
        updateData.anexoCpfRgMotoristaLocatario = files.anexoCpfRgMotoristaLocatario[0].path;
      }
      if (files.anexoEstadoCivilLocatario) {
        updateData.anexoEstadoCivilLocatario = files.anexoEstadoCivilLocatario[0].path;
      }
      if (files.anexoResidenciaLocatario) {
        updateData.anexoResidenciaLocatario = files.anexoResidenciaLocatario[0].path;
      }
      if (files.anexoContratoSocialLocatario) {
        updateData.anexoContratoSocialLocatario = files.anexoContratoSocialLocatario[0].path;
      }
      if (files.anexoUltimoBalancoLocatario) {
        updateData.anexoUltimoBalancoLocatario = files.anexoUltimoBalancoLocatario[0].path;
      }
    }

    // Atualiza o locatário no banco de dados
    const updatedLocatario = await prisma.locatario.update({
      where: { cardId: parseInt(cardId) },
      data: updateData,
    });

    res.status(200).json(updatedLocatario);
  } catch (error) {
    console.error("Erro ao atualizar locatário:", error);
    res.status(500).json({ message: "Erro ao atualizar locatário" });
  }
};

export const addAnexosToCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Verifica se há arquivos enviados no campo 'anexos'
  if (!files || !files.anexos || files.anexos.length === 0) {
    return res.status(400).json({ message: "Nenhum arquivo enviado no campo 'anexos'." });
  }

  try {
    // Verifica se o Card existe
    const card = await prisma.card.findUnique({
      where: { id: parseInt(cardId) },
    });

    if (!card) {
      return res.status(404).json({ message: "Card não encontrado." });
    }

    // Mapeia os novos anexos para o formato do modelo Anexo
    const novosAnexos = files.anexos.map((file) => ({
      path: file.path,
      cardId: card.id,
    }));

    // Cria os anexos no banco de dados
    const anexosCriados = await prisma.anexo.createMany({
      data: novosAnexos,
    });

    res.status(200).json({ message: "Anexos adicionados com sucesso.", anexosCriados });
  } catch (error) {
    console.error("Erro ao adicionar anexos ao Card:", error);
    res.status(500).json({ message: "Erro interno ao adicionar anexos ao Card." });
  }
};

export const getAnexosForCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  console.log(`Recebendo requisição para buscar anexos do card ID: ${cardId}`);

  try {
    const cardIdNumber = parseInt(cardId, 10);
    if (isNaN(cardIdNumber)) {
      console.error(`ID do card inválido: ${cardId}`);
      return res.status(400).json({ message: "ID do card inválido." });
    }

    const card = await prisma.card.findUnique({
      where: { id: cardIdNumber },
      include: { anexos: true }, // Usando 'anexos' após renomeação
    });

    if (!card) {
      console.error(`Card não encontrado com ID: ${cardIdNumber}`);
      return res.status(404).json({ message: "Card não encontrado." });
    }

    console.log(`Anexos encontrados para o card ID ${cardIdNumber}:`, card.anexos);

    res.status(200).json({ anexos: card.anexos });
  } catch (error) {
    console.error("Erro ao buscar anexos do Card:", error);
    res.status(500).json({ message: "Erro interno ao buscar anexos do Card." });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  // Validação básica do cardId
  if (!cardId) {
    return res.status(400).json({ message: "ID do card não fornecido." });
  }

  const cardIdNumber = parseInt(cardId, 10);
  if (isNaN(cardIdNumber)) {
    return res.status(400).json({ message: "ID do card inválido." });
  }

  try {
    // Verifica se o card existe e recupera os anexos
    const card = await prisma.card.findUnique({
      where: { id: cardIdNumber },
      include: { anexos: true }, // Inclui os anexos para obter os caminhos dos arquivos
    });

    if (!card) {
      return res.status(404).json({ message: "Card não encontrado." });
    }

    // Extrai os caminhos dos arquivos dos anexos
    const anexosPaths = card.anexos.map((anexo) => anexo.path);

    // Inicia uma transação para garantir a atomicidade
    await prisma.$transaction([
      // 1. Excluir anexos relacionados
      prisma.anexo.deleteMany({
        where: { cardId: cardIdNumber },
      }),

      // 2. Excluir detalhes do imóvel
      prisma.imovelDetalhes.deleteMany({
        where: { cardId: cardIdNumber },
      }),

      // 3. Excluir imóvel
      prisma.imovel.deleteMany({
        where: { cardId: cardIdNumber },
      }),

      // 4. Excluir proprietário
      prisma.proprietario.deleteMany({
        where: { cardId: cardIdNumber },
      }),

      // 5. Excluir locatário
      prisma.locatario.deleteMany({
        where: { cardId: cardIdNumber },
      }),

      // 6. Excluir o card
      prisma.card.delete({
        where: { id: cardIdNumber },
      }),
    ]);

    // Após a transação bem-sucedida, exclui os arquivos do sistema de arquivos
    const fileDeletionPromises = anexosPaths.map(async (filePath) => {
      try {
        // Resolve o caminho absoluto do arquivo
        const absolutePath = path.resolve(filePath);
        await fs.unlink(absolutePath);
        console.log(`Arquivo excluído: ${absolutePath}`);
      } catch (err) {
        // Log de erro, mas não interrompe o fluxo principal
        console.error(`Erro ao excluir arquivo ${filePath}:`, err);
      }
    });

    await Promise.all(fileDeletionPromises);

    return res.status(200).json({ message: "Card e anexos excluídos com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir card:", error);
    return res.status(500).json({ message: "Erro interno ao excluir card." });
  }
};

export const createBlankCard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.body;

    if (!boardId) {
      return res.status(400).json({ message: "ID do board não fornecido." });
    }

    // Verifica se o board existe
    const board = await prisma.board.findUnique({
      where: { id: parseInt(boardId) },
      include: { columns: true },
    });

    if (!board || board.columns.length === 0) {
      return res.status(400).json({ message: "Board ou colunas não encontradas." });
    }

    const primeiraColuna = board.columns[0];

    // Cria o card juntamente com as entidades associadas em branco
    const novoCard = await prisma.card.create({
      data: {
        columnId: primeiraColuna.id,
        proprietario: {
          create: {
            tipoPessoa: "",
            cnpj: null,
            razaoSocial: null,
            estadoCivil: "",
            cpfConjuge: null,
            nomeCompleto: "",
            nomeCompletoConjuge: null,
            email: "",
            telefone: "",
            nacionalidade: "",
            naturalidade: "",
            dataNascimento: null, // Agora permitido
            cpf: null,
            rg: null,
            orgaoExpedidor: null,
            emailConjuge: null,
            telefoneConjuge: null,
            nacionalidadeConjuge: null,
            naturalidadeConjuge: null,
            dataNascimentoConjuge: null,
            rgConjuge: null,
            orgaoExpedidorConjuge: null,
            cep: "",
            estado: "",
            bairro: "",
            endereco: "",
            numero: "",
            complemento: null,
            anexoCpfRgMotorista: null,
            anexoCpfRgMotoristaConj: null,
            anexoEstadoCivil: null,
            anexoResidencia: null,
            anexoContratoSocial: null,
          },
        },
        imovel: {
          create: {
            tipoImovelSelecionado: "",
            valorAluguel: 0,
            valorIptu: 0,
            valorCondominio: 0,
            valorGas: 0,
            planoSelecionado: "",
            valorMensal: 0,
            taxaSetup: 0,
          },
        },
        imovelDetalhes: {
          create: {
            finalidade: "",
            tipoImovel: "",
            valorAluguel: 0,
            valorCondominio: 0,
            valorIptu: null,
            valorAgua: null,
            valorGas: 0,
            administradorNome: "",
            administradorTelefone: "",
            cepImovel: "",
            cidade: "",
            estado: "",
            bairro: "",
            endereco: "",
            numero: "",
            complemento: null,
            anexoCondominio: null,
            anexoIptu: null,
            anexoAgua: null,
            anexoLuz: null,
            anexoEscritura: null,
          },
        },
        locatario: {
          create: {
            tipoPessoa: "",
            nomeCompleto: "",
            email: "",
            telefone: "",
            nacionalidade: "",
            naturalidade: "",
            estadoCivil: "",
            dataNascimento: null, // Alterado para null
            cpf: null,
            rg: null,
            orgaoExpedidor: null,
            cnpj: null,
            razaoSocial: null,
            cep: "",
            estado: "",
            bairro: "",
            endereco: "",
            numero: "",
            complemento: null,
            anexoCpfRgMotoristaLocatario: null,
            anexoEstadoCivilLocatario: null,
            anexoResidenciaLocatario: null,
            anexoContratoSocialLocatario: null,
            anexoUltimoBalancoLocatario: null,
          },
        },
        anexos: {
          create: [],
        },
      },
      include: {
        proprietario: true,
        imovel: true,
        imovelDetalhes: true,
        locatario: true,
        anexos: true,
      },
    });

    res.status(201).json(novoCard);
  } catch (error) {
    console.error("Erro ao criar card em branco:", error);
    res.status(500).json({ message: "Erro ao criar card em branco." });
  }
};

//Login

export const register = async (req: Request, res: Response) => {
  try {
    const { nome, telefone, email, senha, isAdmin } = req.body;
    const foto = req.file ? req.file.path : null;
    console.log(req.body);

    // Verifique se todos os campos necessários estão presentes
    if (!nome || !telefone || !email || !senha || !foto || (isAdmin !== "sim" && isAdmin !== "não")) {
      return res.status(400).json({
        message: "Algo está faltando ou valores inválidos.",
        success: false,
      });
    }

    // Validações da senha
    if (senha.length < 8) {
      return res.status(400).json({
        message: "A senha deve ter pelo menos 8 caracteres.",
        success: false,
      });
    }

    const hasUpperCase = /[A-Z]/.test(senha);
    if (!hasUpperCase) {
      return res.status(400).json({
        message: "A senha deve conter pelo menos uma letra maiúscula.",
        success: false,
      });
    }

    const hasSpecialChar = /[\W_]/.test(senha);
    if (!hasSpecialChar) {
      return res.status(400).json({
        message: "A senha deve conter pelo menos um caractere especial.",
        success: false,
      });
    }

    const hasDigit = /\d/.test(senha);
    if (!hasDigit) {
      return res.status(400).json({
        message: "A senha deve conter pelo menos um dígito.",
        success: false,
      });
    }

    // Verifique se o email já está sendo usado
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        message: "Email já está sendo utilizado.",
        success: false,
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criação do novo usuário
    const newUser = await prisma.user.create({
      data: {
        nome,
        telefone,
        email,
        senha: hashedPassword,
        foto,
        isAdmin: isAdmin === "sim" ? true : false,
      },
    });

    return res.status(201).json({
      message: "Conta criada com sucesso.",
      success: true,
      newUser,
    });
  } catch (error) {
    console.error("Ocorreu um erro ao criar a conta.", error);
    res.status(500).json({
      message: "Ocorreu um erro ao criar a conta.",
      success: false,
    });
  }
};

// controllers/kanbanControllers.ts
export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios.",
        success: false,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Email ou senha incorretos.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(senha, user.senha);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Email ou senha incorretos.",
        success: false,
      });
    }

    const tokenData = { userId: user.id, isAdmin: user.isAdmin };
    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({
        message: "Erro interno do servidor. Secret Key não está definida.",
        success: false,
      });
    }

    const token = jwt.sign(tokenData, secretKey, {
      expiresIn: "1d",
    });

    const { senha: _, ...userData } = user;

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      success: true,
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Ocorreu um erro ao fazer login.", error);
    res.status(500).json({
      message: "Ocorreu um erro ao fazer login.",
      success: false,
    });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        foto: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado.", success: false });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error);
    res.status(500).json({ message: "Erro interno do servidor.", success: false });
  }
};
export const deleteColumn = async (req: Request, res: Response) => {
  const { columnId } = req.params;

  if (!columnId) {
    return res.status(400).json({ message: "ID da coluna não fornecido" });
  }

  try {
    // Exclui a coluna do banco de dados
    await prisma.column.delete({
      where: { id: parseInt(columnId) },
    });

    res.status(200).json({ message: "Coluna excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir coluna:", error);
    res.status(500).json({ message: "Erro ao excluir coluna" });
  }
};
