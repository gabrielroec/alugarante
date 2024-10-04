/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import ClickSvgIcon from "@/assets/ClickIcon";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api";

const tiposImovel = ["Residencial", "Comercial"];

export default function FirstForm() {
  const { toast } = useToast();
  const router = useRouter();

  // Estado para armazenar o cardId após criar um card vazio
  const [cardId, setCardId] = useState<number | null>(null);

  // Estados para os campos do formulário
  const [tipoImovelSelecionado, setTipoImovelSelecionado] = useState("");
  const [valorAluguel, setValorAluguel] = useState<string>(""); // Inicializado como string vazia
  const [valorIptu, setValorIptu] = useState<string>(""); // Inicializado como string vazia
  const [valorCondominio, setValorCondominio] = useState<string>(""); // Inicializado como string vazia
  const [valorGas, setValorGas] = useState<string>(""); // Inicializado como string vazia
  const [planoSelecionado, setPlanoSelecionado] = useState("");
  const [valorMensal, setValorMensal] = useState(0);
  const [taxaSetup, setTaxaSetup] = useState(0);

  // Função para calcular o valor mensal baseado nos valores e plano selecionado
  const calcularValorMensal = () => {
    const aluguel = valorAluguel ? parseFloat(valorAluguel) : 0;
    const iptu = valorIptu ? parseFloat(valorIptu) : 0;
    const condominio = valorCondominio ? parseFloat(valorCondominio) : 0;
    const gas = valorGas ? parseFloat(valorGas) : 0;

    let valorBase = 0;

    if (planoSelecionado === "Plano 1") {
      valorBase = aluguel * 0.15; // 15% do aluguel + encargos
      setTaxaSetup(100); // Defina o valor correto para Plano 1
    } else if (planoSelecionado === "Plano 2") {
      valorBase = aluguel * 0.12; // 12% do aluguel
      setTaxaSetup(120);
    } else if (planoSelecionado === "Plano 3") {
      valorBase = aluguel * 0.08; // 8% do aluguel
      setTaxaSetup(80);
    } else {
      setTaxaSetup(0);
    }

    setValorMensal(valorBase);
  };

  // Executa a função sempre que algum valor relevante mudar
  useEffect(() => {
    calcularValorMensal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valorAluguel, valorIptu, valorCondominio, valorGas, planoSelecionado]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    if (!tipoImovelSelecionado || !valorAluguel || !valorIptu || !planoSelecionado) {
      toast({
        title: "Erro no envio",
        description: "Por favor, preencha todos os campos obrigatórios antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Criação do card quando o usuário submete o formulário
      const createCardResponse = await api.post("/createCard");
      const createdCardId = createCardResponse.data.cardId;
      setCardId(createdCardId);

      // Cria um objeto com os dados do formulário
      const dadosFormularioImovel = {
        cardId: createdCardId, // Inclui o cardId ao enviar os dados do imóvel
        tipoImovelSelecionado,
        valorAluguel,
        valorIptu, // Envia como string, pode ser vazio
        valorCondominio, // Envia como string, pode ser vazio
        valorGas, // Envia como string, pode ser vazio
        planoSelecionado,
        valorMensal,
        taxaSetup,
      };

      // Enviar os dados do imóvel ao backend
      const response = await api.post("/saveImovelToCard", dadosFormularioImovel);
      console.log(response);

      // Exibe um toast de sucesso
      toast({
        title: "Dados enviados",
        description: "Os dados do imóvel foram salvos com sucesso.",
        variant: "default",
      });

      // Redireciona para o próximo formulário
      router.push(`/formularioparteum?cardId=${createdCardId}`);
    } catch (error) {
      // Exibe um toast em caso de erro
      toast({
        title: "Erro no envio",
        description: "Ocorreu um erro ao enviar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para lidar com a seleção/deseleção dos planos
  const handlePlanoClick = (plano: string) => {
    setPlanoSelecionado((prevPlano) => {
      const novoPlano = prevPlano === plano ? "" : plano;
      if (novoPlano === "") {
        setValorCondominio("");
        setValorGas("");
      }
      return novoPlano;
    });
  };

  return (
    <form className="mt-10" onSubmit={handleSubmit}>
      {/* Select do Tipo de Imóvel */}
      <div className="relative mb-4">
        <select
          value={tipoImovelSelecionado}
          onChange={(e) => setTipoImovelSelecionado(e.target.value)}
          className="w-full border appearance-none rounded-2xl bg-[#024059] text-white p-5 pr-10"
        >
          <option value="">Selecione o tipo do imóvel</option>
          {tiposImovel.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      {/* Input do Valor do Aluguel */}
      <div className="relative mb-4">
        <input
          type="number"
          value={valorAluguel}
          onChange={(e) => setValorAluguel(e.target.value)}
          placeholder="Valor do Aluguel"
          className="w-full border rounded-2xl p-5 bg-white text-gray-900"
        />
      </div>

      {/* Input do Valor do IPTU */}
      <div className="relative mb-4">
        <input
          type="number"
          value={valorIptu}
          onChange={(e) => setValorIptu(e.target.value)}
          placeholder="Valor do IPTU"
          className="w-full border rounded-2xl p-5 bg-white text-gray-900"
        />
      </div>

      {/* Planos */}
      {/* Plano 1 */}
      <div
        className={`relative mb-4 border-b border-gray-300 p-4 rounded-xl ${
          planoSelecionado === "Plano 1" ? "bg-[#87A644] text-white" : "bg-white text-gray-900"
        } cursor-pointer`}
        onClick={() => handlePlanoClick("Plano 1")}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Plano 1</p>
            {planoSelecionado === "Plano 1" && (
              <p className="text-sm text-white">
                Incluso:
                <br />
                Contrato de locação
                <br />
                Assessoria Jurídica
                <br />
                Ação de despejo
                <br />
                Ação de cobrança
                <br />
                Garantia do Aluguel, IPTU, Condomínio e Gás
                <br />
                Cobrança Extrajudicial
                <br />
                Taxa Setup: R$100,00
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <ClickSvgIcon className={`${planoSelecionado === "Plano 1" ? "fill-white" : "fill-[#87A644]"}`} />
          </div>
        </div>
        {/* Campos que aparecem somente quando Plano 1 está selecionado */}
        {planoSelecionado === "Plano 1" && (
          <div className="mt-4 space-y-4">
            {/* Input do Valor do Condomínio */}
            <input
              type="text" // Alterado para "text"
              value={valorCondominio}
              onChange={(e) => setValorCondominio(e.target.value)}
              placeholder="Valor do Condomínio"
              className="w-full border rounded-2xl p-5 bg-white text-gray-900"
              onClick={(e) => e.stopPropagation()} // Previne a propagação do clique
            />

            {/* Input do Valor do Gás */}
            <input
              type="text" // Alterado para "text"
              value={valorGas}
              onChange={(e) => setValorGas(e.target.value)}
              placeholder="Valor do Gás"
              className="w-full border rounded-2xl p-5 bg-white text-gray-900"
              onClick={(e) => e.stopPropagation()} // Previne a propagação do clique
            />
          </div>
        )}
      </div>

      {/* Plano 2 */}
      <div
        className={`relative mb-4 border-b border-gray-300 p-4 rounded-xl ${
          planoSelecionado === "Plano 2" ? "bg-[#87A644] text-white" : "bg-white text-gray-900"
        } cursor-pointer`}
        onClick={() => handlePlanoClick("Plano 2")}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Plano 2</p>
            {planoSelecionado === "Plano 2" && (
              <p className="text-sm text-white">
                Incluso:
                <br />
                Contrato de locação
                <br />
                Assessoria Jurídica
                <br />
                Ação de despejo
                <br />
                Ação de cobrança
                <br />
                Garantia do Aluguel
                <br />
                Cobrança Extrajudicial
                <br />
                Taxa Setup: R$120,00
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <ClickSvgIcon className={`${planoSelecionado === "Plano 2" ? "fill-white" : "fill-[#87A644]"}`} />
          </div>
        </div>
        {/* Campos que aparecem somente quando Plano 2 está selecionado */}
        {planoSelecionado === "Plano 2" && (
          <div className="mt-4 space-y-4">
            {/* Input do Valor do Condomínio */}
            <input
              type="text" // Alterado para "text"
              value={valorCondominio}
              onChange={(e) => setValorCondominio(e.target.value)}
              placeholder="Valor do Condomínio"
              className="w-full border rounded-2xl p-5 bg-white text-gray-900"
              onClick={(e) => e.stopPropagation()} // Previne a propagação do clique
            />

            {/* Input do Valor do Gás */}
            <input
              type="text" // Alterado para "text"
              value={valorGas}
              onChange={(e) => setValorGas(e.target.value)}
              placeholder="Valor do Gás"
              className="w-full border rounded-2xl p-5 bg-white text-gray-900"
              onClick={(e) => e.stopPropagation()} // Previne a propagação do clique
            />
          </div>
        )}
      </div>

      {/* Plano 3 */}
      <div
        className={`relative mb-4 border-b border-gray-300 p-4 rounded-xl ${
          planoSelecionado === "Plano 3" ? "bg-[#87A644] text-white" : "bg-white text-gray-900"
        } cursor-pointer`}
        onClick={() => handlePlanoClick("Plano 3")}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Plano 3</p>
            {planoSelecionado === "Plano 3" && (
              <p className="text-sm text-white">
                Incluso:
                <br />
                Contrato de locação
                <br />
                Assessoria Jurídica
                <br />
                Ação de despejo
                <br />
                Ação de cobrança
                <br />
                Cobrança Extrajudicial
                <br />
                Taxa Setup: R$80,00
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <ClickSvgIcon className={`${planoSelecionado === "Plano 3" ? "fill-white" : "fill-[#87A644]"}`} />
          </div>
        </div>
        {/* Campos que aparecem somente quando Plano 3 está selecionado */}
        {planoSelecionado === "Plano 3" && (
          <div className="mt-4 space-y-4">
            {/* Input do Valor do Condomínio */}
            <input
              type="text" // Alterado para "text"
              value={valorCondominio}
              onChange={(e) => setValorCondominio(e.target.value)}
              placeholder="Valor do Condomínio"
              className="w-full border rounded-2xl p-5 bg-white text-gray-900"
              onClick={(e) => e.stopPropagation()} // Previne a propagação do clique
            />

            {/* Input do Valor do Gás */}
            <input
              type="text" // Alterado para "text"
              value={valorGas}
              onChange={(e) => setValorGas(e.target.value)}
              placeholder="Valor do Gás"
              className="w-full border rounded-2xl p-5 bg-white text-gray-900"
              onClick={(e) => e.stopPropagation()} // Previne a propagação do clique
            />
          </div>
        )}
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">Valor da mensalidade</p>
        <p className="text-4xl font-bold text-gray-800 max-md:text-3xl">R${valorMensal.toFixed(2)}/mês</p>
        <p className="text-sm text-gray-600 mb-4">{taxaSetup > 0 ? `Taxa de Setup: R$${taxaSetup.toFixed(2)}` : "Sem taxa de setup"}</p>
        <button className="bg-[#87A644] text-white px-6 py-6 rounded-lg hover:bg-green-600 mt-10 w-full" type="submit">
          Faça uma cotação agora!
        </button>
      </div>
    </form>
  );
}
