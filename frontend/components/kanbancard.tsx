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
import { useToast } from "@/components/ui/use-toast";
import deleteCardIcon from "../assets/delete-card.svg";
interface Column {
  id: number;
  name: string;
  // Outras propriedades, se houver
}

interface Board {
  id: number;
  name: string;
}
interface KanbanCardProps {
  card: any;
  boardId: number;
  columnName: string;
  columns: Column[];
  onCardRemoved: (cardId: string) => void; // Adicione esta linha
}

const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(({ card, boardId, columnName, columns, onCardRemoved }, forwardedRef) => {
  const [allBoards, setAllBoards] = useState<Board[]>([]);
  const [currentBoardId, setCurrentBoardId] = useState(boardId); // Estado para o board atual

  const { toast } = useToast();

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
        onCardRemoved(cardId.toString());
        toast({
          variant: "default",
          title: "Card movido!",
          description: "Seu card foi movido para o board selecionado!",
        });
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
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [imovelData, setImovelData] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [imovelDetalhesData, setImovelDetalhesData] = useState<any>(null);
  const [proprietarioData, setProprietarioData] = useState<any>(null);
  const [isEditDetalhesDialogOpen, setIsEditDetalhesDialogOpen] = useState(false);
  const [isEditProprietarioOpen, setIsEditProprietarioOpen] = useState(false);
  const [locatarioData, setLocatarioData] = useState<any>(null);
  const [isEditLocatarioOpen, setIsEditLocatarioOpen] = useState(false);
  const [anexos, setAnexos] = useState<string[]>([]);
  const [isUploadAnexosDialogOpen, setIsUploadAnexosDialogOpen] = useState(false);
  const [selectedAnexosFiles, setSelectedAnexosFiles] = useState<FileList | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const fetchLocatarioData = async () => {
    try {
      const response = await api.get(`/locatario/card/${card.id}`);
      setLocatarioData(response.data);
      console.log("Dados do Locatário:", response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do locatário:", error);
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
    } else if (tab === "locatario") {
      fetchLocatarioData(); // Busca os dados do locatário
    } else if (tab === "contratos") {
      fetchCardAnexos(); // Busca os anexos (contratos)
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
      formData.append("tipoPessoa", proprietarioData.tipoPessoa || "");
      formData.append("cnpj", proprietarioData.cnpj || "");
      formData.append("razaoSocial", proprietarioData.razaoSocial || "");
      formData.append("estadoCivil", proprietarioData.estadoCivil || "");
      formData.append("cpfConjuge", proprietarioData.cpfConjuge || "");
      formData.append("nomeCompleto", proprietarioData.nomeCompleto || "");
      formData.append("nomeCompletoConjuge", proprietarioData.nomeCompletoConjuge || "");
      formData.append("email", proprietarioData.email || "");
      formData.append("telefone", proprietarioData.telefone || "");
      formData.append("nacionalidade", proprietarioData.nacionalidade || "");
      formData.append("naturalidade", proprietarioData.naturalidade || "");
      formData.append("dataNascimento", proprietarioData.dataNascimento || "");
      formData.append("cpf", proprietarioData.cpf || "");
      formData.append("rg", proprietarioData.rg || "");
      formData.append("orgaoExpedidor", proprietarioData.orgaoExpedidor || "");
      formData.append("emailConjuge", proprietarioData.emailConjuge || "");
      formData.append("telefoneConjuge", proprietarioData.telefoneConjuge || "");
      formData.append("nacionalidadeConjuge", proprietarioData.nacionalidadeConjuge || "");
      formData.append("naturalidadeConjuge", proprietarioData.naturalidadeConjuge || "");
      formData.append("dataNascimentoConjuge", proprietarioData.dataNascimentoConjuge || "");
      formData.append("rgConjuge", proprietarioData.rgConjuge || "");
      formData.append("orgaoExpedidorConjuge", proprietarioData.orgaoExpedidorConjuge || "");
      formData.append("cep", proprietarioData.cep || "");
      formData.append("estado", proprietarioData.estado || "");
      formData.append("bairro", proprietarioData.bairro || "");
      formData.append("endereco", proprietarioData.endereco || "");
      formData.append("numero", proprietarioData.numero || "");
      formData.append("complemento", proprietarioData.complemento || "");

      // Adiciona os arquivos ao formData, se existirem
      if (proprietarioData.anexoCpfRgMotorista instanceof File) {
        formData.append("anexoCpfRgMotorista", proprietarioData.anexoCpfRgMotorista);
      }
      if (proprietarioData.anexoCpfRgMotoristaConj instanceof File) {
        formData.append("anexoCpfRgMotoristaConj", proprietarioData.anexoCpfRgMotoristaConj);
      }
      if (proprietarioData.anexoEstadoCivil instanceof File) {
        formData.append("anexoEstadoCivil", proprietarioData.anexoEstadoCivil);
      }
      if (proprietarioData.anexoResidencia instanceof File) {
        formData.append("anexoResidencia", proprietarioData.anexoResidencia);
      }
      if (proprietarioData.anexoContratoSocial instanceof File) {
        formData.append("anexoContratoSocial", proprietarioData.anexoContratoSocial);
      }

      // Envia os dados para a API
      await api.put(`/proprietario/card/${card.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Atualiza os dados após salvar
      fetchProprietarioData();

      // Fecha o diálogo
      setIsEditProprietarioOpen(false);
    } catch (error) {
      console.error("Erro ao salvar proprietário:", error);
    }
  };

  const handleEditLocatarioSubmit = async () => {
    try {
      const formData = new FormData();

      // Adiciona os campos de texto ao formData
      formData.append("tipoPessoa", locatarioData.tipoPessoa || "");
      formData.append("nomeCompleto", locatarioData.nomeCompleto || "");
      formData.append("email", locatarioData.email || "");
      formData.append("telefone", locatarioData.telefone || "");
      formData.append("nacionalidade", locatarioData.nacionalidade || "");
      formData.append("naturalidade", locatarioData.naturalidade || "");
      formData.append("estadoCivil", locatarioData.estadoCivil || "");
      formData.append("dataNascimento", locatarioData.dataNascimento || "");
      formData.append("cep", locatarioData.cep || "");
      formData.append("estado", locatarioData.estado || "");
      formData.append("bairro", locatarioData.bairro || "");
      formData.append("endereco", locatarioData.endereco || "");
      formData.append("numero", locatarioData.numero || "");
      formData.append("complemento", locatarioData.complemento || "");

      // Campos condicionais baseados no tipo de pessoa
      if (locatarioData.tipoPessoa === "Física") {
        formData.append("cpf", locatarioData.cpf || "");
        formData.append("rg", locatarioData.rg || "");
        formData.append("orgaoExpedidor", locatarioData.orgaoExpedidor || "");
        formData.append("cnpj", ""); // Definido como vazio
        formData.append("razaoSocial", ""); // Definido como vazio
      } else if (locatarioData.tipoPessoa === "Jurídica") {
        formData.append("cnpj", locatarioData.cnpj || "");
        formData.append("razaoSocial", locatarioData.razaoSocial || "");
        formData.append("cpf", ""); // Definido como vazio
        formData.append("rg", ""); // Definido como vazio
        formData.append("orgaoExpedidor", ""); // Definido como vazio
      }

      // Adiciona os arquivos ao formData, se existirem
      if (locatarioData.anexoCpfRgMotoristaLocatario instanceof File) {
        formData.append("anexoCpfRgMotoristaLocatario", locatarioData.anexoCpfRgMotoristaLocatario);
      }
      if (locatarioData.anexoEstadoCivilLocatario instanceof File) {
        formData.append("anexoEstadoCivilLocatario", locatarioData.anexoEstadoCivilLocatario);
      }
      if (locatarioData.anexoResidenciaLocatario instanceof File) {
        formData.append("anexoResidenciaLocatario", locatarioData.anexoResidenciaLocatario);
      }
      if (locatarioData.anexoContratoSocialLocatario instanceof File) {
        formData.append("anexoContratoSocialLocatario", locatarioData.anexoContratoSocialLocatario);
      }
      if (locatarioData.anexoUltimoBalancoLocatario instanceof File) {
        formData.append("anexoUltimoBalancoLocatario", locatarioData.anexoUltimoBalancoLocatario);
      }

      // Envia os dados para a API
      await api.put(`/locatario/card/${card.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Atualiza os dados após salvar
      fetchLocatarioData();

      // Fecha o diálogo
      setIsEditLocatarioOpen(false);

      // Exibe uma notificação de sucesso
    } catch (error) {
      console.error("Erro ao salvar locatário:", error);
      // Exibe uma notificação de erro
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados do locatário. Tente novamente.",
      });
    }
  };

  const handleInputProprietarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProprietarioData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProprietarioFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setProprietarioData((prevData: any) => ({
        ...prevData,
        [fileType]: file,
      }));
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

  const handleInputLocatarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocatarioData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocatarioFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocatarioData((prevData: any) => ({
        ...prevData,
        [fileType]: file,
      }));
    }
  };

  const handleOpenImageDialog = (imageUrl: string) => {
    const imageUrlCorrect = `http://localhost:5000/${fixPath(imageUrl.replace("uploads/", ""))}`;
    console.log("Imagem URL corrigida: ", imageUrlCorrect); // Verificar se o caminho está correto
    setSelectedImage(imageUrlCorrect);
    setIsImageDialogOpen(true);
  };

  const fetchCardAnexos = async () => {
    try {
      const response = await api.get(`/cards/${card.id}/anexos`);
      // Verifique se os anexos são um array
      if (Array.isArray(response.data.anexos)) {
        setAnexos(response.data.anexos.map((anexo: any) => anexo.path) || []);
      } else {
        console.error("Formato dos anexos inesperado:", response.data.anexos);
        setAnexos([]);
      }
    } catch (error: any) {
      console.error("Erro ao buscar anexos do card:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível buscar os anexos do card.",
      });
    }
  };

  const handleAnexosFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnexosFiles(e.target.files);
  };

  const handleUploadAnexos = async () => {
    if (!selectedAnexosFiles || selectedAnexosFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione pelo menos um arquivo para upload.",
      });
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedAnexosFiles.length; i++) {
      formData.append("anexos", selectedAnexosFiles[i]);
    }

    try {
      const response = await api.post(`/cards/${card.id}/anexos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Atualiza a lista de anexos com os novos anexos
      fetchCardAnexos();

      toast({
        variant: "default",
        title: "Sucesso",
        description: "Anexos adicionados com sucesso.",
      });

      // Fecha o diálogo e reseta os arquivos selecionados
      setIsUploadAnexosDialogOpen(false);
      setSelectedAnexosFiles(null);
    } catch (error) {
      console.error("Erro ao adicionar anexos:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao adicionar os anexos. Tente novamente.",
      });
    }
  };

  const handleDeleteCard = async () => {
    setIsDeleting(true);
    try {
      // Chamada para a API de exclusão
      await api.delete(`/cards/${card.id}`);

      // Notificação de sucesso
      toast({
        variant: "default",
        title: "Card Excluído",
        description: "O card foi excluído com sucesso.",
      });

      // Chama a função para notificar o componente pai sobre a remoção do card
      onCardRemoved(card.id.toString());

      // Fecha o diálogo de exclusão
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erro ao excluir o card:", error);
      toast({
        variant: "destructive",
        title: "Erro na Exclusão",
        description: "Ocorreu um erro ao tentar excluir o card. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
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
                <select value={currentBoardId} onChange={handleBoardChange} className="border border-white outline-0 p-1 w-[100px]">
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

              <Button
                className={`bg-white hover:bg-white text-black p-0 m-0 ${
                  activeTab === "locatario" ? "bg-[#87A644] px-4 text-white hover:bg-[#87A644]" : ""
                }`}
                onClick={() => handleTabClick("locatario")}
              >
                Locatário
              </Button>

              <Button
                className={`bg-white hover:bg-white text-black p-0 m-0 ${
                  activeTab === "contratos" ? "bg-[#87A644] px-4 text-white hover:bg-[#87A644]" : ""
                }`}
                onClick={() => handleTabClick("contratos")}
              >
                Contratos
              </Button>
            </div>

            <div className="rounded-lg overflow-auto border">
              <div className="p-4 bg-[#F5F5F5] border-b flex justify-between items-center">
                {activeTab === "imovel" && "Informações do Imóvel"}
                {activeTab === "detalhesImovel" && "Detalhes do Imóvel"}
                {activeTab === "proprietario" && "Detalhes do Proprietário"}
                {activeTab === "locatario" && "Detalhes do Locatário"}
                {activeTab === "contratos" && "Contratos Anexados"}

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
                {activeTab === "locatario" && (
                  <Button className="bg-[#87A644] text-white hover:bg-[#6f8f35]" onClick={() => setIsEditLocatarioOpen(true)}>
                    Editar
                  </Button>
                )}
                {activeTab === "contratos" && (
                  <Button className="bg-[#87A644] text-white hover:bg-[#6f8f35]" onClick={() => setIsUploadAnexosDialogOpen(true)}>
                    Anexar Contratos
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
                      <p className="flex justify-between">
                        <strong>Anexo CPF RG ou CNH - Cônjuge:</strong>
                        {proprietarioData?.anexoCpfRgMotorista ? (
                          <Button
                            className="bg-white hover:bg-white text-blue-400 p-0 m-b"
                            onClick={() => handleOpenImageDialog(proprietarioData?.anexoCpfRgMotoristaConj)}
                          >
                            Ver Anexo CPF RG ou CNH - Cônjuge
                          </Button>
                        ) : (
                          "-"
                        )}
                      </p>
                      <p className="flex justify-between">
                        <strong>Anexo Estado Cívil:</strong>
                        {proprietarioData?.anexoCpfRgMotorista ? (
                          <Button
                            className="bg-white hover:bg-white text-blue-400 p-0 m-b"
                            onClick={() => handleOpenImageDialog(proprietarioData?.anexoEstadoCivil)}
                          >
                            Ver Anexo Estado Cívil
                          </Button>
                        ) : (
                          "-"
                        )}
                      </p>
                      <p className="flex justify-between">
                        <strong>Anexo Residencial:</strong>
                        {proprietarioData?.anexoCpfRgMotorista ? (
                          <Button
                            className="bg-white hover:bg-white text-blue-400 p-0 m-b"
                            onClick={() => handleOpenImageDialog(proprietarioData?.anexoResidencia)}
                          >
                            Ver Anexo Residencial
                          </Button>
                        ) : (
                          "-"
                        )}
                      </p>
                      <p className="flex justify-between">
                        <strong>Anexo Contrato Social:</strong>
                        {proprietarioData?.anexoCpfRgMotorista ? (
                          <Button
                            className="bg-white hover:bg-white text-blue-400 p-0 m-b"
                            onClick={() => handleOpenImageDialog(proprietarioData?.anexoResidencia)}
                          >
                            Ver Anexo Social
                          </Button>
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "locatario" && locatarioData ? (
                  <div className="flex flex-col items-start gap-4">
                    <p>
                      <strong>Nome Completo:</strong> {locatarioData.nomeCompleto || "-"}
                    </p>
                    <p>
                      <strong>Tipo de Pessoa:</strong> {locatarioData.tipoPessoa || "-"}
                    </p>

                    <p>
                      <strong>CPF:</strong> {locatarioData.cpf || "-"}
                    </p>
                    <p>
                      <strong>RG:</strong> {locatarioData.rg || "-"}
                    </p>
                    <p>
                      <strong>Órgão Expedidor:</strong> {locatarioData.orgaoExpedidor || "-"}
                    </p>

                    <p>
                      <strong>CNPJ:</strong> {locatarioData.cnpj || "-"}
                    </p>
                    <p>
                      <strong>Razão Social:</strong> {locatarioData.razaoSocial || "-"}
                    </p>

                    <p>
                      <strong>Email:</strong> {locatarioData.email || "-"}
                    </p>
                    <p>
                      <strong>Telefone:</strong> {locatarioData.telefone || "-"}
                    </p>
                    <p>
                      <strong>Nacionalidade:</strong> {locatarioData.nacionalidade || "-"}
                    </p>
                    <p>
                      <strong>Naturalidade:</strong> {locatarioData.naturalidade || "-"}
                    </p>
                    <p>
                      <strong>Estado Civil:</strong> {locatarioData.estadoCivil || "-"}
                    </p>
                    <p>
                      <strong>Data de Nascimento:</strong>{" "}
                      {locatarioData.dataNascimento ? new Date(locatarioData.dataNascimento).toLocaleDateString() : "-"}
                    </p>
                    <p>
                      <strong>CEP:</strong> {locatarioData.cep || "-"}
                    </p>
                    <p>
                      <strong>Estado:</strong> {locatarioData.estado || "-"}
                    </p>
                    <p>
                      <strong>Bairro:</strong> {locatarioData.bairro || "-"}
                    </p>
                    <p>
                      <strong>Endereço:</strong> {locatarioData.endereco || "-"}
                    </p>
                    <p>
                      <strong>Número:</strong> {locatarioData.numero || "-"}
                    </p>
                    <p>
                      <strong>Complemento:</strong> {locatarioData.complemento || "-"}
                    </p>

                    {/* Seção de Anexos */}
                    <div className="w-full mt-4">
                      <div className="flex flex-col gap-2">
                        {/* Anexo CPF/RG ou CNH */}
                        <p className="flex items-center justify-between">
                          <strong>Anexo CPF/RG ou CNH:</strong>
                          {locatarioData.anexoCpfRgMotoristaLocatario ? (
                            <Button
                              variant="link"
                              className="text-blue-500 underline"
                              onClick={() => handleOpenImageDialog(locatarioData.anexoCpfRgMotoristaLocatario)}
                            >
                              Ver Anexo
                            </Button>
                          ) : (
                            "-"
                          )}
                        </p>

                        {/* Anexo Estado Civil */}
                        <p className="flex items-center justify-between">
                          <strong>Anexo Estado Civil:</strong>
                          {locatarioData.anexoEstadoCivilLocatario ? (
                            <Button
                              variant="link"
                              className="text-blue-500 underline"
                              onClick={() => handleOpenImageDialog(locatarioData.anexoEstadoCivilLocatario)}
                            >
                              Ver Anexo
                            </Button>
                          ) : (
                            "-"
                          )}
                        </p>

                        {/* Anexo Comprovante de Residência */}
                        <p className="flex items-center justify-between">
                          <strong>Anexo Comprovante de Residência:</strong>
                          {locatarioData.anexoResidenciaLocatario ? (
                            <Button
                              variant="link"
                              className="text-blue-500 underline"
                              onClick={() => handleOpenImageDialog(locatarioData.anexoResidenciaLocatario)}
                            >
                              Ver Anexo
                            </Button>
                          ) : (
                            "-"
                          )}
                        </p>

                        {/* Anexo Contrato Social (se aplicável) */}

                        <p className="flex items-center justify-between">
                          <strong>Anexo Contrato Social:</strong>
                          {locatarioData.anexoContratoSocialLocatario ? (
                            <Button
                              variant="link"
                              className="text-blue-500 underline"
                              onClick={() => handleOpenImageDialog(locatarioData.anexoContratoSocialLocatario)}
                            >
                              Ver Anexo
                            </Button>
                          ) : (
                            "-"
                          )}
                        </p>

                        {/* Anexo Último Balanço Financeiro */}

                        <p className="flex items-center justify-between">
                          <strong>Anexo Último Balanço Financeiro:</strong>
                          {locatarioData.anexoUltimoBalancoLocatario ? (
                            <Button
                              variant="link"
                              className="text-blue-500 underline"
                              onClick={() => handleOpenImageDialog(locatarioData.anexoUltimoBalancoLocatario)}
                            >
                              Ver Anexo
                            </Button>
                          ) : (
                            "-"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {activeTab === "contratos" && (
                  <div className="flex flex-col items-start gap-4">
                    {anexos.length > 0 ? (
                      <>
                        <h3 className="font-semibold mb-2">Contratos Anexados</h3>
                        <ul className="list-disc list-inside">
                          {anexos.map((anexoPath, index) => (
                            <li key={index} className="flex justify-between items-center w-full">
                              <span>Contrato {index + 1}</span>
                              <Button variant="link" className="text-blue-500 underline" onClick={() => handleOpenImageDialog(anexoPath)}>
                                Ver Anexo
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p>Nenhum contrato anexado.</p>
                    )}
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
                <Dialog open={isEditProprietarioOpen} onOpenChange={setIsEditProprietarioOpen}>
                  <DialogContent className="overflow-auto h-4/5">
                    <DialogHeader>
                      <DialogTitle>Editar Dados do Proprietário</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      {/* Campos de texto */}
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Tipo de Pessoa</label>
                          <Input
                            type="text"
                            name="tipoPessoa"
                            value={proprietarioData?.tipoPessoa || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Tipo de Pessoa"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Nome Completo</label>
                          <Input
                            type="text"
                            name="nomeCompleto"
                            value={proprietarioData?.nomeCompleto || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Nome Completo"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>CNPJ</label>
                          <Input
                            type="text"
                            name="cnpj"
                            value={proprietarioData?.cnpj || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="CNPJ"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Razão Social</label>
                          <Input
                            type="text"
                            name="razaoSocial"
                            value={proprietarioData?.razaoSocial || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Razão Social"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>CPF</label>
                          <Input
                            type="text"
                            name="cpf"
                            value={proprietarioData?.cpf || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="CPF"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>RG</label>
                          <Input
                            type="text"
                            name="rg"
                            value={proprietarioData?.rg || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="RG"
                          />
                        </div>
                      </div>
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Órgão Expedidor</label>
                          <Input
                            type="text"
                            name="orgaoExpedidor"
                            value={proprietarioData?.orgaoExpedidor || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Órgão Expedidor"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Estado Civil</label>
                          <Input
                            type="text"
                            name="estadoCivil"
                            value={proprietarioData?.estadoCivil || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Estado Civil"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Email</label>
                          <Input
                            type="email"
                            name="email"
                            value={proprietarioData?.email || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Email"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Telefone</label>
                          <Input
                            type="text"
                            name="telefone"
                            value={proprietarioData?.telefone || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Telefone"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Nacionalidade</label>
                          <Input
                            type="text"
                            name="nacionalidade"
                            value={proprietarioData?.nacionalidade || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Nacionalidade"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Naturalidade</label>
                          <Input
                            type="text"
                            name="naturalidade"
                            value={proprietarioData?.naturalidade || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Naturalidade"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Data de Nascimento</label>
                          <Input
                            type="date"
                            name="dataNascimento"
                            value={proprietarioData?.dataNascimento || ""}
                            onChange={handleInputProprietarioChange}
                          />
                        </div>
                      </div>

                      <h3 className="font-semibold mb-2">Dados do Cônjuge</h3>
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Nome Completo do Cônjuge</label>
                          <Input
                            type="text"
                            name="nomeCompletoConjuge"
                            value={proprietarioData?.nomeCompletoConjuge || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Nome Completo do Cônjuge"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>CPF do Cônjuge</label>
                          <Input
                            type="text"
                            name="cpfConjuge"
                            value={proprietarioData?.cpfConjuge || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="CPF do Cônjuge"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>RG do Cônjuge</label>
                          <Input
                            type="text"
                            name="rgConjuge"
                            value={proprietarioData?.rgConjuge || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="RG do Cônjuge"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Órgão Expedidor do Cônjuge</label>
                          <Input
                            type="text"
                            name="orgaoExpedidorConjuge"
                            value={proprietarioData?.orgaoExpedidorConjuge || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Órgão Expedidor do Cônjuge"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Email do Cônjuge</label>
                          <Input
                            type="email"
                            name="emailConjuge"
                            value={proprietarioData?.emailConjuge || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Email do Cônjuge"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Telefone do Cônjuge</label>
                          <Input
                            type="text"
                            name="telefoneConjuge"
                            value={proprietarioData?.telefoneConjuge || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Telefone do Cônjuge"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Nacionalidade do Cônjuge</label>
                          <Input
                            type="text"
                            name="nacionalidadeConjuge"
                            value={proprietarioData?.nacionalidadeConjuge || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Nacionalidade do Cônjuge"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Naturalidade do Cônjuge</label>
                          <Input
                            type="text"
                            name="naturalidadeConjuge"
                            value={proprietarioData?.naturalidadeConjuge || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Naturalidade do Cônjuge"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Data de Nascimento do Cônjuge</label>
                          <Input
                            type="date"
                            name="dataNascimentoConjuge"
                            value={proprietarioData?.dataNascimentoConjuge || ""}
                            onChange={handleInputProprietarioChange}
                          />
                        </div>
                      </div>

                      {/* Endereço */}
                      <h3 className="font-semibold mb-2">Endereço</h3>
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>CEP</label>
                          <Input
                            type="text"
                            name="cep"
                            value={proprietarioData?.cep || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="CEP"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Estado</label>
                          <Input
                            type="text"
                            name="estado"
                            value={proprietarioData?.estado || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Estado"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Bairro</label>
                          <Input
                            type="text"
                            name="bairro"
                            value={proprietarioData?.bairro || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Bairro"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Endereço</label>
                          <Input
                            type="text"
                            name="endereco"
                            value={proprietarioData?.endereco || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Endereço"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Número</label>
                          <Input
                            type="text"
                            name="numero"
                            value={proprietarioData?.numero || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Número"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Complemento</label>
                          <Input
                            type="text"
                            name="complemento"
                            value={proprietarioData?.complemento || ""}
                            onChange={handleInputProprietarioChange}
                            placeholder="Complemento"
                          />
                        </div>
                      </div>

                      {/* Upload de arquivos */}
                      <h3 className="font-semibold mb-2">Anexos</h3>
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Anexo CPF/RG ou CNH</label>
                          <Input
                            type="file"
                            name="anexoCpfRgMotorista"
                            onChange={(e) => handleProprietarioFileChange(e, "anexoCpfRgMotorista")}
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Anexo CPF/RG ou CNH do Cônjuge</label>
                          <Input
                            type="file"
                            name="anexoCpfRgMotoristaConj"
                            onChange={(e) => handleProprietarioFileChange(e, "anexoCpfRgMotoristaConj")}
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Anexo Estado Civil</label>
                          <Input
                            type="file"
                            name="anexoEstadoCivil"
                            onChange={(e) => handleProprietarioFileChange(e, "anexoEstadoCivil")}
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Anexo Comprovante de Residência</label>
                          <Input type="file" name="anexoResidencia" onChange={(e) => handleProprietarioFileChange(e, "anexoResidencia")} />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Anexo Contrato Social</label>
                          <Input
                            type="file"
                            name="anexoContratoSocial"
                            onChange={(e) => handleProprietarioFileChange(e, "anexoContratoSocial")}
                          />
                        </div>
                      </div>

                      <Button className="w-full mt-10 bg-[#87A644] text-white hover:bg-[#6f8f35]" onClick={handleEditProprietarioSubmit}>
                        Salvar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {isEditLocatarioOpen && (
                <Dialog open={isEditLocatarioOpen} onOpenChange={setIsEditLocatarioOpen}>
                  <DialogContent className="overflow-auto h-4/5">
                    <DialogHeader>
                      <DialogTitle>Editar Dados do Locatário</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      {/* Campos de texto */}
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Tipo de Pessoa</label>
                          <Input
                            type="text"
                            name="tipoPessoa"
                            value={locatarioData?.tipoPessoa || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Tipo de Pessoa (Física/Jurídica)"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Nome Completo</label>
                          <Input
                            type="text"
                            name="nomeCompleto"
                            value={locatarioData?.nomeCompleto || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Nome Completo"
                          />
                        </div>
                      </div>

                      {/* Campos Condicionais para Pessoa Física */}

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>CPF</label>
                          <Input
                            type="text"
                            name="cpf"
                            value={locatarioData?.cpf || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="CPF"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>RG</label>
                          <Input
                            type="text"
                            name="rg"
                            value={locatarioData?.rg || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="RG"
                          />
                        </div>
                      </div>
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Órgão Expedidor</label>
                          <Input
                            type="text"
                            name="orgaoExpedidor"
                            value={locatarioData?.orgaoExpedidor || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Órgão Expedidor"
                          />
                        </div>
                      </div>

                      {/* Campos Condicionais para Pessoa Jurídica */}

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>CNPJ</label>
                          <Input
                            type="text"
                            name="cnpj"
                            value={locatarioData?.cnpj || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="CNPJ"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Razão Social</label>
                          <Input
                            type="text"
                            name="razaoSocial"
                            value={locatarioData?.razaoSocial || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Razão Social"
                          />
                        </div>
                      </div>

                      {/* Campos comuns */}
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Email</label>
                          <Input
                            type="email"
                            name="email"
                            value={locatarioData?.email || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Email"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Telefone</label>
                          <Input
                            type="text"
                            name="telefone"
                            value={locatarioData?.telefone || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Telefone"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Nacionalidade</label>
                          <Input
                            type="text"
                            name="nacionalidade"
                            value={locatarioData?.nacionalidade || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Nacionalidade"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Naturalidade</label>
                          <Input
                            type="text"
                            name="naturalidade"
                            value={locatarioData?.naturalidade || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Naturalidade"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Estado Civil</label>
                          <Input
                            type="text"
                            name="estadoCivil"
                            value={locatarioData?.estadoCivil || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Estado Civil"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Data de Nascimento</label>
                          <Input
                            type="date"
                            name="dataNascimento"
                            value={locatarioData?.dataNascimento ? locatarioData.dataNascimento.substring(0, 10) : ""}
                            onChange={handleInputLocatarioChange}
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>CEP</label>
                          <Input
                            type="text"
                            name="cep"
                            value={locatarioData?.cep || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="CEP"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Estado</label>
                          <Input
                            type="text"
                            name="estado"
                            value={locatarioData?.estado || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Estado"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Bairro</label>
                          <Input
                            type="text"
                            name="bairro"
                            value={locatarioData?.bairro || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Bairro"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Endereço</label>
                          <Input
                            type="text"
                            name="endereco"
                            value={locatarioData?.endereco || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Endereço"
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Número</label>
                          <Input
                            type="text"
                            name="numero"
                            value={locatarioData?.numero || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Número"
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Complemento</label>
                          <Input
                            type="text"
                            name="complemento"
                            value={locatarioData?.complemento || ""}
                            onChange={handleInputLocatarioChange}
                            placeholder="Complemento"
                          />
                        </div>
                      </div>

                      {/* Upload de arquivos */}
                      <h3 className="font-semibold mb-2">Anexos</h3>
                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Anexo CPF/RG ou CNH</label>
                          <Input
                            type="file"
                            name="anexoCpfRgMotoristaLocatario"
                            onChange={(e) => handleLocatarioFileChange(e, "anexoCpfRgMotoristaLocatario")}
                          />
                        </div>
                        <div className="flex flex-col w-full ">
                          <label>Anexo Estado Civil</label>
                          <Input
                            type="file"
                            name="anexoEstadoCivilLocatario"
                            onChange={(e) => handleLocatarioFileChange(e, "anexoEstadoCivilLocatario")}
                          />
                        </div>
                      </div>

                      <div className="flex  gap-4 mb-4">
                        <div className="flex flex-col w-full ">
                          <label>Anexo Comprovante de Residência</label>
                          <Input
                            type="file"
                            name="anexoResidenciaLocatario"
                            onChange={(e) => handleLocatarioFileChange(e, "anexoResidenciaLocatario")}
                          />
                        </div>
                        {locatarioData.tipoPessoa === "Jurídica" && (
                          <>
                            <div className="flex flex-col w-full ">
                              <label>Anexo Contrato Social</label>
                              <Input
                                type="file"
                                name="anexoContratoSocialLocatario"
                                onChange={(e) => handleLocatarioFileChange(e, "anexoContratoSocialLocatario")}
                              />
                            </div>
                            <div className="flex flex-col w-full ">
                              <label>Anexo Último Balanço Financeiro</label>
                              <Input
                                type="file"
                                name="anexoUltimoBalancoLocatario"
                                onChange={(e) => handleLocatarioFileChange(e, "anexoUltimoBalancoLocatario")}
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <Button className="w-full mt-10" onClick={handleEditLocatarioSubmit}>
                        Salvar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {isUploadAnexosDialogOpen && (
                <Dialog open={isUploadAnexosDialogOpen} onOpenChange={setIsUploadAnexosDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Anexar Contratos</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      <Input type="file" multiple onChange={handleAnexosFileSelect} />
                      <Button className="w-full mt-4" onClick={handleUploadAnexos}>
                        Upload
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

        <Button variant="destructive" className="p-0 m-0 bg-white hover:bg-white ml-4" onClick={() => setIsDeleteDialogOpen(true)}>
          <Image src={deleteCardIcon} alt="Deletar" className="p-0 m-0" />
        </Button>
      </div>
      {isDeleteDialogOpen && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Tem certeza de que deseja excluir este card? Essa ação não pode ser desfeita.</p>
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteCard} disabled={isDeleting}>
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
});

KanbanCard.displayName = "KanbanCard";

export default KanbanCard;
