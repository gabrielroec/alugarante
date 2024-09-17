import { Router } from "express";
import {
  getBoards,
  getBoardById,
  getCardsByColumn,
  getColumnsAndCardsByBoardId,
  moveCardToColumn,
  createCard, // Renomeado para createCard
  saveImovelToCard,
  saveProprietarioToCard,
  saveImovelDetalhesToCard,
  saveLocatarioToCard,
  updateColumnName,
} from "../controllers/kanbanControllers";
import upload from "../middlewares/multer"; // Importando o middleware de upload

const router = Router();

// Rota para pegar todos os boards
router.get("/boards", getBoards);

// Rota para pegar um board específico pelo ID e incluir suas colunas e cards
router.get("/board/:boardId", getBoardById);

// Rota para pegar os cards de uma coluna específica
router.get("/columns/:columnId/cards", getCardsByColumn);

// Rota para pegar todas as colunas e seus cards de um board específico
router.get("/boards/:boardId/columns-cards", getColumnsAndCardsByBoardId);

// Rota para atualizar a coluna de um card
router.post("/cards/:cardId/move", moveCardToColumn);

// Rota para criar um card vazio
router.post("/createCard", createCard); // Agora renomeada para createCard

// Rota para salvar Imóvel ao Card
router.post("/saveImovelToCard", saveImovelToCard);

// Rota para salvar Proprietário ao Card com upload de arquivos
router.post(
  "/saveProprietarioToCard",
  upload.fields([
    { name: "anexoCpfRgMotorista", maxCount: 1 },
    { name: "anexoCpfRgMotoristaConj", maxCount: 1 },
    { name: "anexoEstadoCivil", maxCount: 1 },
    { name: "anexoResidencia", maxCount: 1 },
    { name: "anexoContratoSocial", maxCount: 1 },
  ]),
  saveProprietarioToCard
);

// Rota para salvar Imóvel Detalhes ao Card com upload de arquivos
router.post(
  "/saveImovelDetalhesToCard",
  upload.fields([
    { name: "anexoCondominio", maxCount: 1 },
    { name: "anexoIptu", maxCount: 1 },
    { name: "anexoAgua", maxCount: 1 },
    { name: "anexoLuz", maxCount: 1 },
    { name: "anexoEscritura", maxCount: 1 },
  ]),
  saveImovelDetalhesToCard
);

// Rota para salvar Locatário ao Card com upload de arquivos
router.post(
  "/saveLocatarioToCard",
  upload.fields([
    { name: "anexoCpfRgMotoristaLocatario", maxCount: 1 },
    { name: "anexoEstadoCivilLocatario", maxCount: 1 },
    { name: "anexoResidenciaLocatario", maxCount: 1 },
    { name: "anexoContratoSocialLocatario", maxCount: 1 },
    { name: "anexoUltimoBalancoLocatario", maxCount: 1 },
  ]),
  saveLocatarioToCard
);

// Adicionar a rota PATCH para editar o nome da coluna
router.patch("/columns/:columnId", updateColumnName);

export default router;
