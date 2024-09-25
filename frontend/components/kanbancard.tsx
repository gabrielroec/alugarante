/* eslint-disable @next/next/no-img-element */
"use client";
import { forwardRef, useRef, useEffect, useImperativeHandle, useState } from "react";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import viewCard from "../assets/viewcard.svg";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import api from "@/services/api";
import { Input } from "./ui/input";
import { fixPath } from "@/services/fixPath";

interface Column {
  id: number;
  name: string;
  // Outras propriedades, se houver
}

interface KanbanCardProps {
  card: any;
  boardId: number;
  columnName: string;
  columns: Column[];
  onCardRemoved: (cardId: string) => void; // Adicione esta linha
}

const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(({ card, boardId, columnName, columns, onCardRemoved }, forwardedRef) => {
  const [allBoards, setAllBoards] = useState([]); // Estado para armazenar todos os boards
  const [currentBoardId, setCurrentBoardId] = useState(boardId); // Estado para o board atual

  const internalRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id: card.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useImperativeHandle(forwardedRef, () => internalRef.current!);

  const moveCardToBoard = async (cardId: number | string, targetBoardId: number) => {
    try {
      await api.post(`/cards/${cardId}/moveBoard`, { targetBoardId });
      setCurrentBoardId(targetBoardId);

      // Chama a função para remover o card do estado local
      if (onCardRemoved) {
        onCardRemoved(cardId);
      }
    } catch (error) {
      console.error("Erro ao mover card para outro board:", error);
    }
  };

  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBoardId = parseInt(e.target.value);
    moveCardToBoard(card.id, selectedBoardId);
  };

  useEffect(() => {
    if (internalRef.current) {
      drag(internalRef.current);
    }
  }, [drag]);

  // Função para buscar todos os boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await api.get("/boards");
        setAllBoards(response.data);
      } catch (error) {
        console.error("Erro ao buscar boards:", error);
      }
    };

    fetchBoards();
  }, []);

  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Estado para armazenar a imagem selecionada
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false); // Estado para controlar o diálogo de visualização
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [imovelData, setImovelData] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Estado para controlar o diálogo de edição
  const [imovelDetalhesData, setImovelDetalhesData] = useState<any>(null);
  const [proprietarioData, setProprietarioData] = useState<any>(null);
  const [isEditDetalhesDialogOpen, setIsEditDetalhesDialogOpen] = useState(false);
  const [isEditProprietarioOpen, setIsEditProprietarioOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    tipoImovelSelecionado: "",
    valorAluguel: "",
    valorIptu: "",
    valorCondominio: "",
    valorGas: "",
    planoSelecionado: "",
    valorMensal: "",
    taxaSetup: "",
  });

  // Função para buscar dados do imóvel
  const fetchImovelData = async () => {
    try {
      const response = await api.get(`/imovel/card/${card.id}`);
      setImovelData(response.data);
      setEditFormData({
        tipoImovelSelecionado: response.data.tipoImovelSelecionado || "",
        valorAluguel: response.data.valorAluguel || "",
        valorIptu: response.data.valorIptu || "",
        valorCondominio: response.data.valorCondominio || "",
        valorGas: response.data.valorGas || "",
        planoSelecionado: response.data.planoSelecionado || "",
        valorMensal: response.data.valorMensal || "",
        taxaSetup: response.data.taxaSetup || "",
      });
    } catch (error) {
      console.error("Erro ao buscar dados do imóvel:", error);
    }
  };

  // Função para enviar os dados editados
  const handleEditSubmit = async () => {
    try {
      await api.put(`/imovel/card/${card.id}`, editFormData);
      setIsEditDialogOpen(false);
      fetchImovelData(); // Atualizar os dados do imóvel após a edição
    } catch (error) {
      console.error("Erro ao editar imóvel:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Função para determinar o background da coluna
  const getColumnBackground = (index: number): string => {
    const currentColumnIndex = columns.findIndex((col) => col.name === columnName);

    if (index <= currentColumnIndex) {
      return "bg-[url('../assets/arrow-bg.svg')] bg-center bg-no-repeat bg-contain";
    }
    return "text-[#ccc]";
  };

  // Função para buscar os detalhes do imóvel
  const fetchImovelDetalhesData = async () => {
    try {
      const response = await api.get(`/imovelDetalhes/card/${card.id}`);
      setImovelDetalhesData(response.data);
      console.log(imovelData);
    } catch (error) {
      console.error("Erro ao buscar detalhes do imóvel:", error);
    }
  };
  const fetchProprietarioData = async () => {
    try {
      const response = await api.get(`/proprietario/card/${card.id}`);
      setProprietarioData(response.data);
      console.log("Proprietário Data: ", response.data); // Adiciona um log para verificar o conteúdo
    } catch (error) {
      console.error("Erro ao buscar os dados do proprietário:", error);
    }
  };

  // Função para manipular o clique nas abas
  const handleTabClick = (tab: string) => {
    setActiveTab(tab); // Define a aba ativa
    // Carrega os dados somente quando o usuário clica na aba
    if (tab === "imovel") {
      fetchImovelData(); // Busca os dados do imóvel
    } else if (tab === "detalhesImovel") {
      fetchImovelDetalhesData(); // Busca os detalhes do imóvel
    } else if (tab === "proprietario") {
      fetchProprietarioData(); // Busca os dados do proprietário
    }
  };

  const handleEditDetalhesSubmit = async () => {
    try {
      const formData = new FormData();

      // Adiciona os campos de texto ao formData
      formData.append("finalidade", imovelDetalhesData.finalidade);
      formData.append("tipoImovel", imovelDetalhesData.tipoImovel);
      formData.append("valorAluguel", imovelDetalhesData.valorAluguel.toString());
      formData.append("valorCondominio", imovelDetalhesData.valorCondominio.toString());
      formData.append("valorIptu", imovelDetalhesData.valorIptu?.toString() || "");
      formData.append("valorAgua", imovelDetalhesData.valorAgua?.toString() || "");
      formData.append("valorGas", imovelDetalhesData.valorGas.toString());
      formData.append("administradorNome", imovelDetalhesData.administradorNome);
      formData.append("administradorTelefone", imovelDetalhesData.administradorTelefone);
      formData.append("cepImovel", imovelDetalhesData.cepImovel);
      formData.append("cidade", imovelDetalhesData.cidade);
      formData.append("estado", imovelDetalhesData.estado);
      formData.append("bairro", imovelDetalhesData.bairro);
      formData.append("endereco", imovelDetalhesData.endereco);
      formData.append("numero", imovelDetalhesData.numero);
      formData.append("complemento", imovelDetalhesData.complemento);

      // Adiciona os arquivos ao formData, se existirem
      if (imovelDetalhesData.anexoCondominio instanceof File) {
        formData.append("anexoCondominio", imovelDetalhesData.anexoCondominio);
      }
      if (imovelDetalhesData.anexoIptu instanceof File) {
        formData.append("anexoIptu", imovelDetalhesData.anexoIptu);
      }
      if (imovelDetalhesData.anexoAgua instanceof File) {
        formData.append("anexoAgua", imovelDetalhesData.anexoAgua);
      }
      if (imovelDetalhesData.anexoLuz instanceof File) {
        formData.append("anexoLuz", imovelDetalhesData.anexoLuz);
      }
      if (imovelDetalhesData.anexoEscritura instanceof File) {
        formData.append("anexoEscritura", imovelDetalhesData.anexoEscritura);
      }

      // Envia os dados para a API
      await api.put(`/imovelDetalhes/card/${card.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Atualiza os dados após salvar
      fetchImovelDetalhesData();

      // Fecha o diálogo
      setIsEditDetalhesDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar detalhes do imóvel:", error);
    }
  };

  const handleEditProprietarioSubmit = async () => {
    try {
      const formData = new FormData();

      // Adiciona os campos de texto ao formData
      formData.append("nomeCompleto", proprietarioData.nomeCompleto);
      formData.append("tipoPessoa", proprietarioData.tipoPessoa);
      formData.append("cnpj", proprietarioData.cnpj.toString());
      formData.append("razaoSocial", proprietarioData.razaoSocial.toString());
      formData.append("estadoCivil", proprietarioData.estadoCivil?.toString() || "");
      formData.append("valorAgua", proprietarioData.valorAgua?.toString() || "");
      formData.append("valorGas", proprietarioData.valorGas.toString());
      formData.append("administradorNome", proprietarioData.administradorNome);
      formData.append("administradorTelefone", proprietarioData.administradorTelefone);
      formData.append("cepImovel", proprietarioData.cepImovel);
      formData.append("cidade", proprietarioData.cidade);
      formData.append("estado", proprietarioData.estado);
      formData.append("bairro", proprietarioData.bairro);
      formData.append("endereco", proprietarioData.endereco);
      formData.append("numero", proprietarioData.numero);
      formData.append("complemento", proprietarioData.complemento);

      // Adiciona os arquivos ao formData, se existirem
      if (proprietarioData.anexoCondominio instanceof File) {
        formData.append("anexoCondominio", proprietarioData.anexoCondominio);
      }
      if (proprietarioData.anexoIptu instanceof File) {
        formData.append("anexoIptu", proprietarioData.anexoIptu);
      }
      if (proprietarioData.anexoAgua instanceof File) {
        formData.append("anexoAgua", proprietarioData.anexoAgua);
      }
      if (proprietarioData.anexoLuz instanceof File) {
        formData.append("anexoLuz", proprietarioData.anexoLuz);
      }
      if (proprietarioData.anexoEscritura instanceof File) {
        formData.append("anexoEscritura", proprietarioData.anexoEscritura);
      }

      // Envia os dados para a API
      await api.put(`/imovelDetalhes/card/${card.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Atualiza os dados após salvar
      fetchImovelDetalhesData();

      // Fecha o diálogo
      setIsEditDetalhesDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar detalhes do imóvel:", error);
    }
  };

  const handleInputDetalhesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setImovelDetalhesData((prevData: any) => ({
      ...prevData,
      [name]: value, // Atualiza o valor do campo correspondente
      // Preserva os arquivos que já foram anexados
      anexoCondominio: prevData.anexoCondominio,
      anexoIptu: prevData.anexoIptu,
      anexoAgua: prevData.anexoAgua,
      anexoLuz: prevData.anexoLuz,
      anexoEscritura: prevData.anexoEscritura,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setImovelDetalhesData((prevData: any) => ({
        ...prevData,
        [fileType]: file, // Substitui apenas o arquivo correspondente
      }));
    }
  };

  const handleOpenImageDialog = (imageUrl: string) => {
    const imageUrlCorrect = `http://localhost:5000/${fixPath(imageUrl.replace("uploads/", ""))}`;
    console.log("Imagem URL corrigida: ", imageUrlCorrect); // Verificar se o caminho está correto
    setSelectedImage(imageUrlCorrect);
    setIsImageDialogOpen(true);
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
        <Dialog
          open={isDialogOpen}
          onOpenChange={(isOpen) => {
            setIsDialogOpen(isOpen);
            if (isOpen) {
              fetchImovelDetalhesData(); // Chama ao abrir o diálogo
              handleTabClick(activeTab);
            } else {
              // Reseta os dados quando o diálogo é fechado
              setImovelData(null);
              setImovelDetalhesData(null);
              setProprietarioData(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="p-0 m-0 bg-white hover:bg-white">
              <Image src={viewCard} alt="ver card" />
            </Button>
          </DialogTrigger>

          <DialogContent className="w-full max-w-[840px] ">
            <DialogHeader>
              <DialogTitle className="text-3xl font-normal uppercase">
                {imovelDetalhesData ? (
                  <>
                    {imovelDetalhesData.endereco || "-"}, {imovelDetalhesData.numero || "-"}, {imovelDetalhesData.bairro || "-"},
                    {imovelDetalhesData.cidade || "-"}, {imovelDetalhesData.estado || "-"}
                  </>
                ) : (
                  "Carregando dados do imóvel..."
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-4">
              <div className="">
                <span className="font-bold">Board atual: </span>
                <select value={currentBoardId} onChange={handleBoardChange} className="border rounded p-1">
                  {allBoards.map((board) => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="">
                <span className="font-bold">Coluna atual: </span>
                <span>{columnName}</span>
              </div>
            </div>

            {/* Exibir colunas com backgrounds */}
            <div className="flex items-center gap-4">
              {columns &&
                columns.map((col: Column, index: number) => (
                  <div key={col.id} className={`p-2 rounded-lg text-white px-5 ${getColumnBackground(index)}`}>
                    {col.name}
                  </div>
                ))}
            </div>

            <div className="flex items-center gap-10">
              <Button
                className={`bg-white hover:bg-white text-black p-0 m-0 ${
                  activeTab === "imovel" ? "bg-[#87A644] px-4 text-white hover:bg-[#87A644]" : ""
                }`}
                onClick={() => handleTabClick("imovel")}
              >
                Imóvel
              </Button>
              <Button
                className={`bg-white hover:bg-white text-black p-0 m-0 ${
                  activeTab === "detalhesImovel" ? "bg-[#87A644] px-4 text-white hover:bg-[#87A644]" : ""
                }`}
                onClick={() => handleTabClick("detalhesImovel")}
              >
                Detalhes do Imóvel
              </Button>
              <Button
                className={`bg-white hover:bg-white text-black p-0 m-0 ${
                  activeTab === "proprietario" ? "bg-[#87A644] px-4 text-white hover:bg-[#87A644]" : ""
                }`}
                onClick={() => handleTabClick("proprietario")}
              >
                Proprietário
              </Button>

              <Button className="bg-white hover:bg-white text-black p-0 m-0">Locatário</Button>
              <Button className="bg-white hover:bg-white text-black p-0 m-0">Contratos</Button>
            </div>

            <div className="rounded-lg overflow-auto border">
              <div className="p-4 bg-[#F5F5F5] border-b flex justify-between items-center">
                {activeTab === "imovel" && "Informações do Imóvel"}
                {activeTab === "detalhesImovel" && "Detalhes do Imóvel"}
                {activeTab === "proprietario" && "Detalhes do Proprietário"}

                {activeTab === "imovel" && (
                  <Button className="bg-[#87A644] text-white hover:bg-[#6f8f35]" onClick={() => setIsEditDialogOpen(true)}>
                    Editar
                  </Button>
                )}
                {activeTab === "detalhesImovel" && (
                  <Button className="bg-[#87A644] text-white hover:bg-[#6f8f35]" onClick={() => setIsEditDetalhesDialogOpen(true)}>
                    Editar
                  </Button>
                )}
                {activeTab === "proprietario" && (
                  <Button className="bg-[#87A644] text-white hover:bg-[#6f8f35]" onClick={() => setIsEditProprietarioOpen(true)}>
                    Editar
                  </Button>
                )}
              </div>

              <div className="p-4 h-[500px]">
                {activeTab === "imovel" && imovelData ? (
                  <div className="flex flex-col items-start gap-4">
                    <p>
                      <strong>Tipo do Imóvel:</strong> {imovelData.tipoImovelSelecionado}
                    </p>
                    <p>
                      <strong>Valor do Aluguel:</strong> R$ {imovelData.valorAluguel}
                    </p>
                    <p>
                      <strong>Valor do IPTU:</strong> R$ {imovelData.valorIptu}
                    </p>
                    <p>
                      <strong>Condomínio:</strong> R$ {imovelData.valorCondominio}
                    </p>
                    <p>
                      <strong>Valor do Gás</strong> R$ {imovelData.valorGas}
                    </p>
                    <p>
                      <strong>Plano selecionado:</strong> {imovelData.planoSelecionado}
                    </p>
                    <p>
                      <strong>Taxa Setup:</strong> R$ {imovelData.taxaSetup}
                    </p>
                  </div>
                ) : (
                  ""
                )}
                {activeTab === "detalhesImovel" && imovelDetalhesData ? (
                  <div className="flex flex-col items-start gap-4">
                    <p>
                      <strong>Finalidade:</strong> {imovelDetalhesData.finalidade || "-"}
                    </p>
                    <p>
                      <strong>Tipo de Imóvel:</strong> {imovelDetalhesData.tipoImovel || "-"}
                    </p>
                    <p>
                      <strong>Valor do Aluguel:</strong> R$ {imovelDetalhesData.valorAluguel || "-"}
                    </p>
                    <p>
                      <strong>Valor do Condomínio:</strong> R$ {imovelDetalhesData.valorCondominio || "-"}
                    </p>
                    <p>
                      <strong>Valor do IPTU:</strong> R$ {imovelDetalhesData.valorIptu || "-"}
                    </p>
                    <p>
                      <strong>Valor da Água:</strong> R$ {imovelDetalhesData.valorAgua || "-"}
                    </p>
                    <p>
                      <strong>Valor do Gás:</strong> R$ {imovelDetalhesData.valorGas || "-"}
                    </p>
                    <p>
                      <strong>Administrador Nome:</strong> {imovelDetalhesData.administradorNome || "-"}
                    </p>
                    <p>
                      <strong>Administrador Telefone:</strong> {imovelDetalhesData.administradorTelefone || "-"}
                    </p>
                    <p>
                      <strong>CEP Imóvel:</strong> {imovelDetalhesData.cepImovel || "-"}
                    </p>
                    <p>
                      <strong>Cidade:</strong> {imovelDetalhesData.cidade || "-"}
                    </p>
                    <p>
                      <strong>Estado:</strong> {imovelDetalhesData.estado || "-"}
                    </p>
                    <p>
                      <strong>Bairro:</strong> {imovelDetalhesData.bairro || "-"}
                    </p>
                    <p>
                      <strong>Endereço:</strong> {imovelDetalhesData.endereco || "-"}
                    </p>
                    <p>
                      <strong>Número:</strong> {imovelDetalhesData.numero || "-"}
                    </p>
                    <p>
                      <strong>Complemento:</strong> {imovelDetalhesData.complemento || "-"}
                    </p>

                    {/* Exibe botões para visualizar os anexos ou "-" */}
                    <div className="w-full">
                      <p className="flex justify-between">
                        <strong>Anexo Condomínio:</strong>
                        {imovelDetalhesData.anexoCondominio ? (
                          <Button
                            className="bg-white hover:bg-white text-blue-400 p-0 m-b"
                            onClick={() => handleOpenImageDialog(imovelDetalhesData.anexoCondominio)}
                          >
                            Ver Anexo Condomínio
                          </Button>
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>

                    <div className="w-full">
                      <p className="flex justify-between">
                        <strong>Anexo IPTU:</strong>
                        {imovelDetalhesData.anexoIptu ? (
                          <Button
                            className="bg-white hover:bg-white text-blue-400 p-0 m-b"
                            onClick={() => handleOpenImageDialog(imovelDetalhesData.anexoIptu)}
                          >
                            Ver Anexo IPTU
                          </Button>
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>

                    <div className="w-full">
                      <p className="flex justify-between">
                        <strong>Anexo Água:</strong>
                        {imovelDetalhesData.anexoAgua ? (
                          <Button
                            className="bg-white hover:bg-white text-blue-400 p-0 m-b"
                            onClick={() => handleOpenImageDialog(imovelDetalhesData.anexoAgua)}
                          >
                            Ver Anexo Água
                          </Button>
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>

                    <div className="w-full">
                      <p className="flex justify-between">
                        <strong>Anexo Luz:</strong>
                        {imovelDetalhesData.anexoLuz ? (
                          <Button
                            className="bg-white hover:bg-white text-blue-400 p-0 m-b"
                            onClick={() => handleOpenImageDialog(imovelDetalhesData.anexoLuz)}
                          >
                            Ver Anexo Luz
                          </Button>
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>

                    <div className="w-full">
                      <p className="flex justify-between">
                        <strong>Anexo Escritura:</strong>
                        {imovelDetalhesData.anexoEscritura ? (
                          <Button
                            className="bg-white hover:bg-white text-blue-400 p-0 m-b"
                            onClick={() => handleOpenImageDialog(imovelDetalhesData.anexoEscritura)}
                          >
                            Ver Anexo Escritura
                          </Button>
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {activeTab === "proprietario" && (
                  <div className="flex flex-col items-start gap-4">
                    <p>
                      <strong>Nome Completo:</strong> {proprietarioData?.nomeCompleto || "-"}
                    </p>
                    <p>
                      <strong>Tipo pessoa:</strong> {proprietarioData?.tipoPessoa || "-"}
                    </p>
                    <p>
                      <strong>CNPJ</strong> {proprietarioData?.cnpj || "-"}
                    </p>
                    <p>
                      <strong>Razão Social:</strong> {proprietarioData?.razaoSocial || "-"}
                    </p>
                    <p>
                      <strong>Estado Civil:</strong> {proprietarioData?.estadoCicil || "Solteiro"}
                    </p>
                    <p>
                      <strong>CPF do Cônjuge:</strong> {proprietarioData?.cpfConjuge || "-"}
                    </p>
                    <p>
                      <strong>Nome Completo do Cônjuge:</strong> {proprietarioData?.nomeCompletoConjuge || "-"}
                    </p>
                    <p>
                      <strong>Email:</strong> {proprietarioData?.email || "-"}
                    </p>
                    <p>
                      <strong>Telefone:</strong> {proprietarioData?.telefone || "-"}
                    </p>
                    <p>
                      <strong>Nacionalidade: </strong> {proprietarioData?.nacionalidade || "-"}
                    </p>
                    <p>
                      <strong>Data de Nascimento:</strong> {proprietarioData?.dataNascimento || "-"}
                    </p>
                    <p>
                      <strong>CPF:</strong> {proprietarioData?.cpf || "-"}
                    </p>
                    <p>
                      <strong>RG:</strong> {proprietarioData?.rg || "-"}
                    </p>
                    <p>
                      <strong>Orgão Expeditor:</strong> {proprietarioData?.orgaoExpeditor || "-"}
                    </p>
                    <p>
                      <strong>Email do Cônjuge:</strong> {proprietarioData?.emailConjuge || "-"}
                    </p>
                    <p>
                      <strong>Telefone do Cônjuge:</strong> {proprietarioData?.telefoneConjuge || "-"}
                    </p>
                    <p>
                      <strong>Nacionalidade do Cônjuge:</strong> {proprietarioData?.nacionalidadeConjuge || "-"}
                    </p>
                    <p>
                      <strong>Naturalidade do Cônjuge:</strong> {proprietarioData?.naturalidadeConjuge || "-"}
                    </p>
                    <p>
                      <strong>Data de Nascimento do Cônjuge:</strong> {proprietarioData?.dataNascimentoConjuge || "-"}
                    </p>
                    <p>
                      <strong>RG do Cônjuge:</strong> {proprietarioData?.rgConjuge || "-"}
                    </p>
                    <p>
                      <strong>Orgão Expeditor do Cônjuge:</strong> {proprietarioData?.orgaoExpeditorConjuge || "-"}
                    </p>
                    <p>
                      <strong>CEP:</strong> {proprietarioData?.cep || "-"}
                    </p>
                    <p>
                      <strong>Estado:</strong> {proprietarioData?.estado || "-"}
                    </p>
                    <p>
                      <strong>Endereço:</strong> {proprietarioData?.endereco || "-"}
                    </p>
                    <p>
                      <strong>Número:</strong> {proprietarioData?.numero || "-"}
                    </p>
                    <p>
                      <strong>Complemento:</strong> {proprietarioData?.complemento || "-"}
                    </p>

                    {/* Exibe botões para visualizar os anexos ou "-" */}
                    <div className="w-full">
                      <p className="flex justify-between">
                        <strong>Anexo CPF RG ou CNH:</strong>
                        {proprietarioData?.anexoCpfRgMotorista ? (
                          <Button
                            className="bg-white hover:bg-white text-blue-400 p-0 m-b"
                            onClick={() => handleOpenImageDialog(proprietarioData?.anexoCpfRgMotorista)}
                          >
                            Ver Anexo CPF RG ou CNH
                          </Button>
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {isEditDialogOpen && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Imóvel</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      <div className="flex gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Tipo de Imóvel</label>
                          <Input
                            className="w-full max-w-full"
                            type="text"
                            name="tipoImovelSelecionado"
                            value={editFormData.tipoImovelSelecionado}
                            onChange={handleInputChange}
                            placeholder="Tipo de Imóvel"
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <label>Valor do Aluguel</label>
                          <Input
                            className="w-full max-w-full"
                            type="text"
                            name="valorAluguel"
                            value={editFormData.valorAluguel}
                            onChange={handleInputChange}
                            placeholder="Valor do Aluguel"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Valor do IPTU</label>
                          <Input
                            className="w-full max-w-full"
                            type="text"
                            name="valorIptu"
                            value={editFormData.valorIptu}
                            onChange={handleInputChange}
                            placeholder="Valor do IPTU"
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <label>Valor do Condomínio</label>
                          <Input
                            className="w-full max-w-full"
                            type="text"
                            name="valorCondominio"
                            value={editFormData.valorCondominio}
                            onChange={handleInputChange}
                            placeholder="Valor do Condomínio"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Valor do Gás</label>
                          <Input
                            className="w-full max-w-full"
                            type="text"
                            name="valorGas"
                            value={editFormData.valorGas}
                            onChange={handleInputChange}
                            placeholder="Valor do Gás"
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <label>Plano Selecionado</label>
                          <Input
                            className="w-full max-w-full"
                            type="text"
                            name="planoSelecionado"
                            value={editFormData.planoSelecionado}
                            onChange={handleInputChange}
                            placeholder="Plano Selecionado"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Valor Mensal</label>
                          <Input
                            className="w-full max-w-full"
                            type="text"
                            name="valorMensal"
                            value={editFormData.valorMensal}
                            onChange={handleInputChange}
                            placeholder="Valor Mensal"
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <label>Taxa Setup</label>
                          <Input
                            className="w-full max-w-full"
                            type="text"
                            name="taxaSetup"
                            value={editFormData.taxaSetup}
                            onChange={handleInputChange}
                            placeholder="Taxa de Setup"
                          />
                        </div>
                      </div>
                      <Button className="w-full mt-10" onClick={handleEditSubmit}>
                        Salvar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {isEditDetalhesDialogOpen && (
                <Dialog open={isEditDetalhesDialogOpen} onOpenChange={setIsEditDetalhesDialogOpen}>
                  <DialogContent className="overflow-auto h-4/5">
                    <DialogHeader>
                      <DialogTitle>Editar Detalhes do Imóvel</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      {/* Campos de texto */}
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Finalidade</label>
                          <Input
                            type="text"
                            name="finalidade"
                            value={imovelDetalhesData?.finalidade || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Finalidade"
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <label>Tipo de Imóvel</label>
                          <Input
                            type="text"
                            name="tipoImovel"
                            value={imovelDetalhesData?.tipoImovel || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Tipo de Imóvel"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Valor do Aluguel</label>
                          <Input
                            type="number"
                            name="valorAluguel"
                            value={imovelDetalhesData?.valorAluguel || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Valor do Aluguel"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Valor do Condomínio</label>
                          <Input
                            type="number"
                            name="valorCondominio"
                            value={imovelDetalhesData?.valorCondominio || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Valor do Condomínio"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Valor do IPTU</label>
                          <Input
                            type="number"
                            name="valorIptu"
                            value={imovelDetalhesData?.valorIptu || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Valor do IPTU"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Valor da Água</label>
                          <Input
                            type="number"
                            name="valorAgua"
                            value={imovelDetalhesData?.valorAgua || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Valor da Água"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Valor do Gás</label>
                          <Input
                            type="number"
                            name="valorGas"
                            value={imovelDetalhesData?.valorGas || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Valor do Gás"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Administrador Nome</label>
                          <Input
                            type="text"
                            name="administradorNome"
                            value={imovelDetalhesData?.administradorNome || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Nome do Administrador"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Administrador Telefone</label>
                          <Input
                            type="text"
                            name="administradorTelefone"
                            value={imovelDetalhesData?.administradorTelefone || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Telefone do Administrador"
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <label>CEP Imóvel</label>
                          <Input
                            type="text"
                            name="cepImovel"
                            value={imovelDetalhesData?.cepImovel || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="CEP do Imóvel"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Cidade</label>
                          <Input
                            type="text"
                            name="cidade"
                            value={imovelDetalhesData?.cidade || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Cidade"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Estado</label>
                          <Input
                            type="text"
                            name="estado"
                            value={imovelDetalhesData?.estado || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Estado"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Bairro</label>
                          <Input
                            type="text"
                            name="bairro"
                            value={imovelDetalhesData?.bairro || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Bairro"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Endereço</label>
                          <Input
                            type="text"
                            name="endereco"
                            value={imovelDetalhesData?.endereco || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Endereço"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Número</label>
                          <Input
                            type="text"
                            name="numero"
                            value={imovelDetalhesData?.numero || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Número"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Complemento</label>
                          <Input
                            type="text"
                            name="complemento"
                            value={imovelDetalhesData?.complemento || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Complemento"
                          />
                        </div>
                      </div>

                      {/* Upload de arquivos */}
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Anexo Condomínio</label>
                          <Input type="file" name="anexoCondominio" onChange={(e) => handleFileChange(e, "anexoCondominio")} />

                          {/* {imovelDetalhesData.anexoCondominio ? (
                              <p>
                                Arquivo atual:{" "}
                                {imovelDetalhesData.anexoCondominio instanceof File
                                  ? imovelDetalhesData.anexoCondominio.name
                                  : imovelDetalhesData.anexoCondominio}
                              </p>
                            ) : (
                              <p>- anexo de condomínio</p>
                            )} */}
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Anexo IPTU</label>
                          <Input type="file" name="anexoIptu" onChange={(e) => handleFileChange(e, "anexoIptu")} />
                          {/* {imovelDetalhesData.anexoIptu ? (
                              <p>
                                Arquivo atual:{" "}
                                {imovelDetalhesData.anexoIptu instanceof File
                                  ? imovelDetalhesData.anexoIptu.name
                                  : imovelDetalhesData.anexoIptu}
                              </p>
                            ) : (
                              <p>- anexo de IPTU</p>
                            )} */}
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Anexo Água</label>
                          <Input type="file" name="anexoAgua" onChange={(e) => handleFileChange(e, "anexoAgua")} />
                          {/* {imovelDetalhesData.anexoAgua ? (
                              <p>
                                Arquivo atual:{" "}
                                {imovelDetalhesData.anexoAgua instanceof File
                                  ? imovelDetalhesData.anexoAgua.name
                                  : imovelDetalhesData.anexoAgua}
                              </p>
                            ) : (
                              <p>- anexo de água</p>
                            )} */}
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Anexo Luz</label>
                          <Input type="file" name="anexoLuz" onChange={(e) => handleFileChange(e, "anexoLuz")} />
                          {/* {imovelDetalhesData.anexoLuz ? (
                              <p>
                                Arquivo atual:{" "}
                                {imovelDetalhesData.anexoLuz instanceof File
                                  ? imovelDetalhesData.anexoLuz.name
                                  : imovelDetalhesData.anexoLuz}
                              </p>
                            ) : (
                              <p>- anexo de luz</p>
                            )} */}
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Anexo Escritura</label>
                          <Input type="file" name="anexoEscritura" onChange={(e) => handleFileChange(e, "anexoEscritura")} />
                          {/* {imovelDetalhesData.anexoEscritura ? (
                              <p>
                                Arquivo atual:{" "}
                                {imovelDetalhesData.anexoEscritura instanceof File
                                  ? imovelDetalhesData.anexoEscritura.name
                                  : imovelDetalhesData.anexoEscritura}
                              </p>
                            ) : (
                              <p>- anexo de escritura</p>
                            )} */}
                        </div>
                      </div>

                      <Button className="w-full mt-10" onClick={handleEditDetalhesSubmit}>
                        Salvar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {isEditProprietarioOpen && (
                <Dialog open={isEditDetalhesDialogOpen} onOpenChange={setIsEditDetalhesDialogOpen}>
                  <DialogContent className="overflow-auto h-4/5">
                    <DialogHeader>
                      <DialogTitle>Editar Detalhes do Imóvel</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      {/* Campos de texto */}
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Finalidade</label>
                          <Input
                            type="text"
                            name="finalidade"
                            value={imovelDetalhesData?.finalidade || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Finalidade"
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <label>Tipo de Imóvel</label>
                          <Input
                            type="text"
                            name="tipoImovel"
                            value={imovelDetalhesData?.tipoImovel || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Tipo de Imóvel"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Valor do Aluguel</label>
                          <Input
                            type="number"
                            name="valorAluguel"
                            value={imovelDetalhesData?.valorAluguel || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Valor do Aluguel"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Valor do Condomínio</label>
                          <Input
                            type="number"
                            name="valorCondominio"
                            value={imovelDetalhesData?.valorCondominio || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Valor do Condomínio"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Valor do IPTU</label>
                          <Input
                            type="number"
                            name="valorIptu"
                            value={imovelDetalhesData?.valorIptu || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Valor do IPTU"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Valor da Água</label>
                          <Input
                            type="number"
                            name="valorAgua"
                            value={imovelDetalhesData?.valorAgua || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Valor da Água"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Valor do Gás</label>
                          <Input
                            type="number"
                            name="valorGas"
                            value={imovelDetalhesData?.valorGas || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Valor do Gás"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Administrador Nome</label>
                          <Input
                            type="text"
                            name="administradorNome"
                            value={imovelDetalhesData?.administradorNome || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Nome do Administrador"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Administrador Telefone</label>
                          <Input
                            type="text"
                            name="administradorTelefone"
                            value={imovelDetalhesData?.administradorTelefone || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Telefone do Administrador"
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <label>CEP Imóvel</label>
                          <Input
                            type="text"
                            name="cepImovel"
                            value={imovelDetalhesData?.cepImovel || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="CEP do Imóvel"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Cidade</label>
                          <Input
                            type="text"
                            name="cidade"
                            value={imovelDetalhesData?.cidade || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Cidade"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Estado</label>
                          <Input
                            type="text"
                            name="estado"
                            value={imovelDetalhesData?.estado || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Estado"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Bairro</label>
                          <Input
                            type="text"
                            name="bairro"
                            value={imovelDetalhesData?.bairro || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Bairro"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Endereço</label>
                          <Input
                            type="text"
                            name="endereco"
                            value={imovelDetalhesData?.endereco || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Endereço"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Número</label>
                          <Input
                            type="text"
                            name="numero"
                            value={imovelDetalhesData?.numero || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Número"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Complemento</label>
                          <Input
                            type="text"
                            name="complemento"
                            value={imovelDetalhesData?.complemento || ""}
                            onChange={handleInputDetalhesChange}
                            placeholder="Complemento"
                          />
                        </div>
                      </div>

                      {/* Upload de arquivos */}
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Anexo Condomínio</label>
                          <Input type="file" name="anexoCondominio" onChange={(e) => handleFileChange(e, "anexoCondominio")} />

                          {/* {imovelDetalhesData.anexoCondominio ? (
                              <p>
                                Arquivo atual:{" "}
                                {imovelDetalhesData.anexoCondominio instanceof File
                                  ? imovelDetalhesData.anexoCondominio.name
                                  : imovelDetalhesData.anexoCondominio}
                              </p>
                            ) : (
                              <p>- anexo de condomínio</p>
                            )} */}
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Anexo IPTU</label>
                          <Input type="file" name="anexoIptu" onChange={(e) => handleFileChange(e, "anexoIptu")} />
                          {/* {imovelDetalhesData.anexoIptu ? (
                              <p>
                                Arquivo atual:{" "}
                                {imovelDetalhesData.anexoIptu instanceof File
                                  ? imovelDetalhesData.anexoIptu.name
                                  : imovelDetalhesData.anexoIptu}
                              </p>
                            ) : (
                              <p>- anexo de IPTU</p>
                            )} */}
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Anexo Água</label>
                          <Input type="file" name="anexoAgua" onChange={(e) => handleFileChange(e, "anexoAgua")} />
                          {/* {imovelDetalhesData.anexoAgua ? (
                              <p>
                                Arquivo atual:{" "}
                                {imovelDetalhesData.anexoAgua instanceof File
                                  ? imovelDetalhesData.anexoAgua.name
                                  : imovelDetalhesData.anexoAgua}
                              </p>
                            ) : (
                              <p>- anexo de água</p>
                            )} */}
                        </div>

                        <div className="flex flex-col w-full">
                          <label>Anexo Luz</label>
                          <Input type="file" name="anexoLuz" onChange={(e) => handleFileChange(e, "anexoLuz")} />
                          {/* {imovelDetalhesData.anexoLuz ? (
                              <p>
                                Arquivo atual:{" "}
                                {imovelDetalhesData.anexoLuz instanceof File
                                  ? imovelDetalhesData.anexoLuz.name
                                  : imovelDetalhesData.anexoLuz}
                              </p>
                            ) : (
                              <p>- anexo de luz</p>
                            )} */}
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full">
                          <label>Anexo Escritura</label>
                          <Input type="file" name="anexoEscritura" onChange={(e) => handleFileChange(e, "anexoEscritura")} />
                          {/* {imovelDetalhesData.anexoEscritura ? (
                              <p>
                                Arquivo atual:{" "}
                                {imovelDetalhesData.anexoEscritura instanceof File
                                  ? imovelDetalhesData.anexoEscritura.name
                                  : imovelDetalhesData.anexoEscritura}
                              </p>
                            ) : (
                              <p>- anexo de escritura</p>
                            )} */}
                        </div>
                      </div>

                      <Button className="w-full mt-10" onClick={handleEditDetalhesSubmit}>
                        Salvar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {selectedImage && (
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Visualização de Anexo</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center items-center">
                      {/* URL completa para a imagem servida pelo backend */}
                      <Image src={selectedImage} alt="Visualização de Anexo" className="w-full max-h-full" width={768} height={768} />
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setIsImageDialogOpen(false)}>Fechar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
});

KanbanCard.displayName = "KanbanCard";

export default KanbanCard;
