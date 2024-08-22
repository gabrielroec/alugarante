"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import ProfileFoto from "@/assets/profile-foto.png";
import { useKanban } from "@/contexts/KanbanContext";
import { Button } from "./ui/button";
import { Pipelines } from "@/types/kanban";

const Header = () => {
  const { selectedPipeline, setSelectedPipeline } = useKanban();
  const handlePipelineChange = (value: string) => {
    console.log("Pipeline selecionado:", value);
    setSelectedPipeline(value as keyof Pipelines);
  };

  return (
    <header className="flex justify-between items-center bg-white  flex-col border-b border-[f5f5f5]">
      <div className="flex items-center justify-between w-full py-8 border-b border-[F5F5F5] px-10">
        <p className="text-gray-600">Bem-vindo, Marco!</p>
        <div className="ml-4">
          <Image src={ProfileFoto} alt="Profile Foto" width={32} height={32} className="rounded-full" />
        </div>
      </div>
      <div className="flex items-center justify-between w-full py-8">
        <div className="px-10">
          <Select onValueChange={handlePipelineChange} value={String(selectedPipeline)}>
            <SelectTrigger className="text-lg font-semibold bg-transparent border-none outline-none cursor-pointer">
              <SelectValue placeholder="Selecione uma pipeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Início">Início</SelectItem>
              <SelectItem value="Contratos ativos">Contratos ativos</SelectItem>
              <SelectItem value="Cobrança Extrajudicial">Cobrança Extrajudicial</SelectItem>
              <SelectItem value="Cobrança Judicial">Cobrança Judicial</SelectItem>
              <SelectItem value="Contratos inativos">Contratos inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="px-10 w-full flex items-center">
          <input type="text" placeholder="Pesquisar..." className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none w-full" />
          <Button className="ml-4 px-4 py-2 bg-[#87A644] text-white rounded-lg">Filtrar</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
