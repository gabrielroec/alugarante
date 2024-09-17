"use client";
import { forwardRef, useRef, useEffect, useImperativeHandle } from "react";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";

// Encaminhar o ref com forwardRef para funcionar corretamente com React DnD e Framer Motion
const KanbanCard = forwardRef<HTMLDivElement, { card: any }>(({ card }, forwardedRef) => {
  const internalRef = useRef<HTMLDivElement>(null); // Criação de ref interno
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id: card.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Usar useImperativeHandle para controlar o forwardedRef de forma segura
  useImperativeHandle(forwardedRef, () => internalRef.current);

  // Aplicar a combinação de refs de drag e do motion.div
  useEffect(() => {
    if (internalRef.current) {
      drag(internalRef.current);
    }
  }, [drag]);

  // Função para truncar texto com "..."
  const truncateText = (text: string, limit: number = 15) => {
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
  };

  return (
    <motion.div
      ref={internalRef} // Usa o internalRef, que está corretamente vinculado
      initial={{ scale: 0 }}
      animate={isDragging ? { scale: 0 } : { scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className={`p-4 bg-white rounded-lg mb-2 ${isDragging ? "opacity-50" : ""}`}
    >
      {/* Endereço */}
      <h3 className="font-semibold">Endereço:</h3>
      <p className="text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
        {card.imovelDetalhes
          ? truncateText(
              `${card.imovelDetalhes?.endereco}, ${card.imovelDetalhes?.numero} - ${card.imovelDetalhes?.bairro}, ${card.imovelDetalhes?.cidade} - ${card.imovelDetalhes?.estado}`
            )
          : "Dados do endereço"}
      </p>

      {/* Proprietário (Locador) */}
      <h3 className="font-semibold">Locador:</h3>
      <p className="text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
        {card.proprietario?.nomeCompleto ? truncateText(card.proprietario?.nomeCompleto) : "Dados do locador"}
      </p>

      {/* Locatário */}
      <h3 className="font-semibold">Locatário:</h3>
      <p className="text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
        {card.locatario?.nomeCompleto ? truncateText(card.locatario?.nomeCompleto) : "Dados do locatário"}
      </p>
    </motion.div>
  );
});

// Adicionar displayName para o componente
KanbanCard.displayName = "KanbanCard";

// forwardRef precisa ser usado ao exportar o componente
export default KanbanCard;
