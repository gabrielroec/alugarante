import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import kanbanRoutes from "./routes/kanbanRoutes"; // Importando as rotas do Kanban
import cors from "cors"; // Importando o CORS

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Configurando CORS para permitir requisições do frontend
app.use(
  cors({
    origin: "http://localhost:3000", // Verifique se o frontend está rodando nessa origem
    credentials: true,
  })
);

// Substitua body-parser por express.json()
app.use(express.json()); // Isso permite que o Express processe requisições JSON

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

// Usando as rotas do Kanban
app.use("/api", kanbanRoutes);
