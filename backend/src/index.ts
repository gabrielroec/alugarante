// index.ts
import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import kanbanRoutes from "./routes/kanbanRoutes"; // Importando as rotas do Kanban
import cors from "cors"; // Importando o CORS
import path from "path";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Configurando CORS para permitir requisições do frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Defina o URL do seu frontend
    credentials: true, // Permite o envio de cookies
  })
);

// Substitua body-parser por express.json()
app.use(express.json()); // Isso permite que o Express processe requisições JSON

// Servir arquivos estáticos da pasta 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Usando as rotas do Kanban
app.use("/api", kanbanRoutes);

// Conectando ao Prisma e inicializando o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Conectado ao banco de dados");
  } catch (error) {
    console.error("Falha ao conectar ao banco de dados", error);
  }

  console.log(`Servidor rodando na porta ${PORT}`);
});
