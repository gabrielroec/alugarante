"use client";
import { forwardRef, useRef, useEffect, useImperativeHandle, useState } from "react";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import viewCard from "../assets/viewcard.svg";
import columnArrow from "../assets/arrow-bg.svg"; // Importando a imagem
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

// Encaminhar o ref com forwardRef para funcionar corretamente com React DnD e Framer Motion
const KanbanCard = forwardRef<HTMLDivElement, { card: any; boardName: string; columnName: string; columns: any[] }>(
  ({ card, boardName, columnName, columns }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "CARD",
      item: { id: card.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    useImperativeHandle(forwardedRef, () => internalRef.current);

    useEffect(() => {
      if (internalRef.current) {
        drag(internalRef.current);
      }
    }, [drag]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Função para determinar o background da coluna
    const getColumnBackground = (index: number) => {
      // Obtendo o índice da coluna atual
      const currentColumnIndex = columns.findIndex((col) => col.name === columnName);

      // Se a coluna for a atual ou anterior, aplica o background
      if (index <= currentColumnIndex) {
        return `bg-contain bg-center bg-no-repeat  bg-[url('../assets/arrow-bg.svg')]`; // Usando o background image com a seta
      }
      return "text-gray-500"; // Colunas posteriores sem background (ou outro estilo desejado)
    };

    return (
      <motion.div
        ref={internalRef}
        initial={{ scale: 0 }}
        animate={isDragging ? { scale: 0 } : { scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className={`p-4 bg-white rounded-lg mb-2 ${isDragging ? "opacity-50" : ""}`}
      >
        <div>
          <h3 className="font-semibold">Endereço:</h3>
          <p className="text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
            {card.imovelDetalhes
              ? `${card.imovelDetalhes?.endereco}, ${card.imovelDetalhes?.numero} - ${card.imovelDetalhes?.bairro}, ${card.imovelDetalhes?.cidade} - ${card.imovelDetalhes?.estado}`
              : "Dados do endereço"}
          </p>

          <h3 className="font-semibold">Locador:</h3>
          <p className="text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
            {card.proprietario?.nomeCompleto ? card.proprietario?.nomeCompleto : "Dados do locador"}
          </p>

          <h3 className="font-semibold">Locatário:</h3>
          <p className="text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
            {card.locatario?.nomeCompleto ? card.locatario?.nomeCompleto : "Dados do locatário"}
          </p>
        </div>

        {/* Botão para abrir o diálogo */}
        <div className="w-full flex items-center justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="p-0 m-0 bg-white hover:bg-white">
                <Image src={viewCard} alt="ver card" />
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl font-normal uppercase">
                  {card.imovelDetalhes?.endereco}, {card.imovelDetalhes?.numero}, {card.imovelDetalhes?.bairro},{" "}
                  {card.imovelDetalhes?.cidade}, {card.imovelDetalhes?.estado}
                </DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-4">
                <div className="">
                  <span className="font-bold">Board atual: </span>
                  <span>{boardName}</span>
                </div>
                <div className="">
                  <span className="font-bold">Coluna atual: </span>
                  <span>{columnName}</span>
                </div>
              </div>

              {/* Exibir colunas com backgrounds */}
              <div className="flex items-center gap-4">
                {columns.map((col, index) => (
                  <div
                    key={col.id}
                    className={`p-2 rounded-lg text-white ${getColumnBackground(index)} px-4`} // Aplica o background conforme a condição
                  >
                    {col.name}
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button onClick={() => setIsDialogOpen(false)}>Fechar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
    );
  }
);

KanbanCard.displayName = "KanbanCard";

export default KanbanCard;
