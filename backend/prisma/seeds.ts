import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed para criar boards e colunas
  const boards = [
    {
      name: "Início",
      columns: [{ name: "Coluna 1 - Início" }, { name: "Coluna 2 - Início" }],
    },
    {
      name: "Contratos ativos",
      columns: [{ name: "Coluna 1 - Contratos ativos" }, { name: "Coluna 2 - Contratos ativos" }],
    },
    {
      name: "Cobrança Extrajudicial",
      columns: [{ name: "Coluna 1 - Cobrança Extrajudicial" }, { name: "Coluna 2 - Cobrança Extrajudicial" }],
    },
    {
      name: "Cobrança Judicial",
      columns: [{ name: "Coluna 1 - Cobrança Judicial" }, { name: "Coluna 2 - Cobrança Judicial" }],
    },
    {
      name: "Contratos inativos",
      columns: [{ name: "Coluna 1 - Contratos inativos" }, { name: "Coluna 2 - Contratos inativos" }],
    },
  ];

  for (const board of boards) {
    await prisma.board.create({
      data: {
        name: board.name,
        columns: {
          create: board.columns,
        },
      },
    });
  }

  console.log("Boards e colunas criados com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
