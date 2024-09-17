import { Request, Response } from "express";
import { prisma } from "../prismaClient"; // Importação do Prisma
import upload from "../middlewares/multer";

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
  let { imovel, proprietario, imovelDetalhes, locatario } = req.body;
  // console.log(req.body);
  console.log(req.body.imovel);
  console.log(req.body.proprietario);
  console.log(req.body.imovelDetalhes);
  console.log(req.body.locatario);
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const board = await prisma.board.findFirst({
      include: {
        columns: true,
      },
    });

    if (!board || board.columns.length === 0) {
      return res.status(400).json({ message: "Board ou colunas não encontradas." });
    }

    const primeiraColuna = board.columns[0];
    // console.log(files);

    const novoCard = await prisma.card.create({
      data: {
        columnId: primeiraColuna.id,
        imovel: {
          create: {
            tipoImovelSelecionado: imovel.tipoImovelSelecionado,
            valorAluguel: parseFloat(imovel.valorAluguel),
            valorIptu: parseFloat(imovel.valorIptu),
            valorCondominio: parseFloat(imovel.valorCondominio),
            valorGas: parseFloat(imovel.valorGas),
            planoSelecionado: imovel.planoSelecionado,
            valorMensal: parseFloat(imovel.valorMensal),
            taxaSetup: parseFloat(imovel.taxaSetup),
          },
        },
        proprietario: {
          create: {
            tipoPessoa: proprietario.tipoPessoa,
            cnpj: proprietario.cnpj,
            razaoSocial: proprietario.razaoSocial,
            estadoCivil: proprietario.estadoCivil,
            cpfConjuge: proprietario.cpfConjuge,
            nomeCompleto: proprietario.nomeCompleto,
            nomeCompletoConjuge: proprietario.nomeCompletoConjuge,
            email: proprietario.email,
            telefone: proprietario.telefone,
            nacionalidade: proprietario.nacionalidade,
            naturalidade: proprietario.naturalidade,
            dataNascimento: new Date(proprietario.dataNascimento),
            cpf: proprietario.cpf,
            rg: proprietario.rg,
            orgaoExpedidor: proprietario.orgaoExpedidor,
            emailConjuge: proprietario.emailConjuge,
            telefoneConjuge: proprietario.telefoneConjuge,
            nacionalidadeConjuge: proprietario.nacionalidadeConjuge,
            naturalidadeConjuge: proprietario.naturalidadeConjuge,
            dataNascimentoConjuge: proprietario.dataNascimentoConjuge ? new Date(proprietario.dataNascimentoConjuge) : null,
            rgConjuge: proprietario.rgConjuge,
            orgaoExpedidorConjuge: proprietario.orgaoExpedidorConjuge,
            cep: proprietario.cep,
            estado: proprietario.estado,
            bairro: proprietario.bairro,
            endereco: proprietario.endereco,
            numero: proprietario.numero,
            complemento: proprietario.complemento,
            anexoCpfRgMotorista: files.anexoCpfRgMotorista ? files.anexoCpfRgMotorista[0].path : null,
            anexoCpfRgMotoristaConj: files.anexoCpfRgMotoristaConj ? files.anexoCpfRgMotoristaConj[0].path : null,
            anexoEstadoCivil: files.anexoEstadoCivil ? files.anexoEstadoCivil[0].path : null,
            anexoResidencia: files.anexoResidencia ? files.anexoResidencia[0].path : null,
            anexoContratoSocial: files.anexoContratoSocial ? files.anexoContratoSocial[0].path : null,
          },
        },
        imovelDetalhes: {
          create: {
            finalidade: imovelDetalhes.finalidade,
            tipoImovel: imovelDetalhes.tipoImovel,
            valorAluguel: parseFloat(imovelDetalhes.valorAluguel),
            valorCondominio: parseFloat(imovelDetalhes.valorCondominio),
            valorIptu: imovelDetalhes.valorIptu ? parseFloat(imovelDetalhes.valorIptu) : null,
            valorAgua: imovelDetalhes.valorAgua ? parseFloat(imovelDetalhes.valorAgua) : null,
            valorGas: imovelDetalhes.valorGas ? parseFloat(imovelDetalhes.valorGas) : null,
            administradorNome: imovelDetalhes.administradorNome,
            administradorTelefone: imovelDetalhes.administradorTelefone,
            cepImovel: imovelDetalhes.cepImovel,
            cidade: imovelDetalhes.cidade,
            estado: imovelDetalhes.estado,
            bairro: imovelDetalhes.bairro,
            endereco: imovelDetalhes.endereco,
            numero: imovelDetalhes.numero,
            complemento: imovelDetalhes.complemento,
            anexoCondominio: files.anexoCondominio ? files.anexoCondominio[0].path : null,
            anexoIptu: files.anexoIptu ? files.anexoIptu[0].path : null,
            anexoAgua: files.anexoAgua ? files.anexoAgua[0].path : null,
            anexoLuz: files.anexoLuz ? files.anexoLuz[0].path : null,
            anexoEscritura: files.anexoEscritura ? files.anexoEscritura[0].path : null,
          },
        },
        locatario: {
          create: {
            tipoPessoa: locatario.tipoPessoa,
            nomeCompleto: locatario.nomeCompleto,
            email: locatario.email,
            telefone: locatario.telefone,
            nacionalidade: locatario.nacionalidade,
            naturalidade: locatario.naturalidade,
            estadoCivil: locatario.estadoCivil,
            dataNascimento: new Date(locatario.dataNascimento),
            cpf: locatario.tipoPessoa === "Física" ? locatario.cpf : null,
            rg: locatario.tipoPessoa === "Física" ? locatario.rg : null,
            orgaoExpedidor: locatario.tipoPessoa === "Física" ? locatario.orgaoExpedidor : null,
            cnpj: locatario.tipoPessoa === "Jurídica" ? locatario.cnpj : null,
            razaoSocial: locatario.tipoPessoa === "Jurídica" ? locatario.razaoSocial : null,
            cep: locatario.cep,
            estado: locatario.estado,
            bairro: locatario.bairro,
            endereco: locatario.endereco,
            numero: locatario.numero,
            complemento: locatario.complemento,
            anexoCpfRgMotoristaLocatario: files.anexoCpfRgMotoristaLocatario ? files.anexoCpfRgMotoristaLocatario[0].path : null,
            anexoEstadoCivilLocatario: files.anexoEstadoCivilLocatario ? files.anexoEstadoCivilLocatario[0].path : null,
            anexoResidenciaLocatario: files.anexoResidenciaLocatario ? files.anexoResidenciaLocatario[0].path : null,
            anexoContratoSocialLocatario: files.anexoContratoSocialLocatario ? files.anexoContratoSocialLocatario[0].path : null,
            anexoUltimoBalancoLocatario: files.anexoUltimoBalancoLocatario ? files.anexoUltimoBalancoLocatario[0].path : null,
          },
        },
      },
      include: {
        imovel: true,
        proprietario: true,
        imovelDetalhes: true,
        locatario: true,
      },
    });

    res.status(200).json(novoCard);
    console.log(req.body.imovel);
  } catch (error: any) {
    // console.error("Erro ao criar card:", error)
    res.status(500).json({ message: "Erro ao criar card" });
  }
};
