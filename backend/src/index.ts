import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import kanbanRoutes from "./routes/kanbanRoutes"; // Importando as rotas do Kanban
import cors from "cors"; // Importando o CORS
import path from "path";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Configurando CORS para permitir requisições do frontend e do localhost:3000
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Substitua body-parser por express.json()
app.use(express.json()); // Isso permite que o Express processe requisições JSON

// Servir arquivos estáticos da pasta 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Usando as rotas do Kanban
app.use("/api", kanbanRoutes);

// Conectando ao Prisma e inicializando o servidor
app.listen(5000, async () => {
  try {
    await prisma.$connect();
    console.log("Conectado ao banco de dados");
  } catch (error) {
    console.error("Falha ao conectar ao banco de dados", error);
  }

  console.log("Servidor rodando na porta 5000");
});
