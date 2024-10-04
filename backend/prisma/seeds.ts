import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed para criar boards e colunas
  const boards = [
    {
      name: "Início",
      columns: [{ name: "Início" }, { name: "Início" }],
    },
    {
      name: "Contratos ativos",
      columns: [{ name: "Contratos ativos" }, { name: "Contratos ativos" }],
    },
    {
      name: "Cobrança Extrajudicial",
      columns: [{ name: "Cobrança Extrajudicial" }, { name: "Cobrança Extrajudicial" }],
    },
    {
      name: "Cobrança Judicial",
      columns: [{ name: "Cobrança Judicial" }, { name: "Cobrança Judicial" }],
    },
    {
      name: "Contratos inativos",
      columns: [{ name: "Contratos inativos" }, { name: "Contratos inativos" }],
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
