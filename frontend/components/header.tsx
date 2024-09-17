"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import ProfileFoto from "@/assets/profile-foto.png";
import { fetchBoards, fetchBoardById } from "@/redux/boardSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { Button } from "./ui/button";

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { boards, loading, error } = useSelector((state: RootState) => state.boards);

  // State para controlar o valor do board selecionado
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  // Carregar os boards ao montar o componente
  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  // Quando os boards forem carregados, definir o primeiro board como o selecionado
  useEffect(() => {
    if (boards.length > 0 && !selectedBoardId) {
      const firstBoardId = boards[0].id;
      setSelectedBoardId(firstBoardId);
      dispatch(fetchBoardById(firstBoardId));
    }
  }, [boards, selectedBoardId, dispatch]);

  // Função chamada quando o usuário seleciona um board
  const handleBoardChange = (boardId: string) => {
    setSelectedBoardId(boardId); // Atualiza o estado do board selecionado
    dispatch(fetchBoardById(boardId)); // Busca o board selecionado
    console.log("Board selecionado:", boardId);
  };

  return (
    <header className="flex justify-between items-center bg-white flex-col border-b border-[f5f5f5]">
      <div className="flex items-center justify-between w-full py-8 border-b border-[F5F5F5] px-10">
        <p className="text-gray-600">Bem-vindo, Marco!</p>
        <div className="ml-4">
          <Image src={ProfileFoto} alt="Profile Foto" width={32} height={32} className="rounded-full" />
        </div>
      </div>

      <div className="flex items-center justify-between w-full py-8">
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p>Erro: {error}</p>
        ) : (
          <div className="px-10">
            <Select value={selectedBoardId || ""} onValueChange={handleBoardChange}>
              <SelectTrigger className="text-lg font-semibold bg-transparent border-none outline-none cursor-pointer">
                <SelectValue placeholder="Selecione um board" />
              </SelectTrigger>
              <SelectContent>
                {boards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="px-10 w-full flex items-center">
          <input type="text" placeholder="Pesquisar..." className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none w-full" />
          <Button className="ml-4 px-4 py-2 bg-[#87A644] text-white rounded-lg">Filtrar</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
