"use client";
import { useState, useEffect } from "react";
import ClickSvg from "../assets/click.svg";
import ClickSvgIcon from "@/assets/ClickIcon";
import Image from "next/image";

// Arrays de opções para os selects
const estados = ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná", "Santa Catarina"];
const tiposImovel = ["Apartamento", "Casa", "Comercial", "Terreno"];
const faixasAluguel = ["R$500 - R$1000", "R$1000 - R$2000", "R$2000 - R$3000", "R$3000 - R$5000", "Acima de R$5000"];

export default function FirstForm() {
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [tipoImovelSelecionado, setTipoImovelSelecionado] = useState("");
  const [faixaAluguelSelecionada, setFaixaAluguelSelecionada] = useState("");
  const [coberturaFurto, setCoberturaFurto] = useState(false);
  const [assistencia24h, setAssistencia24h] = useState(false);
  const [valorMensal, setValorMensal] = useState(99.9);

  // Função para calcular o valor com base nas escolhas
  const calcularValorMensal = () => {
    let valorBase = 99.9; // Valor inicial base

    // Ajustar o valor dependendo da faixa de aluguel
    if (faixaAluguelSelecionada === "R$1000 - R$2000") {
      valorBase += 30;
    } else if (faixaAluguelSelecionada === "R$2000 - R$3000") {
      valorBase += 50;
    } else if (faixaAluguelSelecionada === "R$3000 - R$5000") {
      valorBase += 80;
    } else if (faixaAluguelSelecionada === "Acima de R$5000") {
      valorBase += 120;
    }

    // Cobertura de furto/roubo adiciona um valor fixo
    if (coberturaFurto) {
      valorBase += 20;
    }

    // Assistência 24h adiciona um valor fixo
    if (assistencia24h) {
      valorBase += 15;
    }

    setValorMensal(valorBase);
  };

  // Usar useEffect para recalcular o valor quando as opções mudarem
  useEffect(() => {
    calcularValorMensal();
  }, [faixaAluguelSelecionada, coberturaFurto, assistencia24h]);

  // Função para lidar com o submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir o comportamento padrão de recarregar a página

    // Capturar os dados selecionados pelo usuário
    const dadosFormulario = {
      estadoSelecionado,
      tipoImovelSelecionado,
      faixaAluguelSelecionada,
      coberturaFurto,
      assistencia24h,
      valorMensal,
    };

    // Aqui você pode enviar os dados para uma API, salvar no local storage, ou fazer qualquer outra ação
    console.log("Dados do formulário:", dadosFormulario);

    // Exemplo de envio para uma API:
    // fetch('/api/submit', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(dadosFormulario),
    // });
  };

  return (
    <form className="mt-10" onSubmit={handleSubmit}>
      {/* Campo Estado */}
      <div className="relative mb-4">
        <select
          value={estadoSelecionado}
          onChange={(e) => setEstadoSelecionado(e.target.value)}
          className="w-full border appearance-none rounded-2xl bg-[#024059] text-white p-5 pr-10"
        >
          <option value="">Selecione um estado</option>
          {estados.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
        {/* Ícone SVG */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Image src={ClickSvg} alt="clique" />
        </div>
      </div>

      {/* Campo Tipo de Imóvel */}
      <div className="relative mb-4">
        <select
          value={tipoImovelSelecionado}
          onChange={(e) => setTipoImovelSelecionado(e.target.value)}
          className="w-full border appearance-none rounded-2xl bg-[#024059] text-white p-5 pr-10"
        >
          <option value="">Selecione o tipo de imóvel</option>
          {tiposImovel.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Image src={ClickSvg} alt="clique" />
        </div>
      </div>

      {/* Campo Preço do Aluguel */}
      <div className="relative mb-4">
        <select
          value={faixaAluguelSelecionada}
          onChange={(e) => setFaixaAluguelSelecionada(e.target.value)}
          className="w-full border appearance-none rounded-2xl bg-[#024059] text-white p-5 pr-10"
        >
          <option value="">Selecione a faixa de aluguel</option>
          {faixasAluguel.map((faixa) => (
            <option key={faixa} value={faixa}>
              {faixa}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Image src={ClickSvg} alt="clique" />
        </div>
      </div>

      {/* Cobertura contra furto/roubo */}
      <div
        className={`relative mb-4 border-b border-gray-300 p-4 rounded-xl ${
          coberturaFurto ? "bg-[#87A644] text-white" : "bg-white text-gray-900"
        }`}
        onClick={() => {
          setCoberturaFurto(!coberturaFurto);
          console.log("Cobertura contra furto/roubo:", !coberturaFurto);
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Cobertura contra furto/roubo</p>
            <p className="text-sm text-gray-500">Pagamento 100% do preço até 100mil</p>
          </div>
          {/* Ícone SVG à direita */}
          <div className="flex items-center space-x-2">
            <ClickSvgIcon className={`${coberturaFurto ? "fill-white" : "fill-[#87A644]"}`} />
          </div>
        </div>
      </div>

      {/* Assistência 24h */}
      <div
        className={`relative mb-4 border-b border-gray-300 p-4 rounded-xl ${
          assistencia24h ? "bg-[#87A644] text-white" : "bg-white text-gray-900"
        }`}
        onClick={() => {
          setAssistencia24h(!assistencia24h);
          console.log("Assistência 24h:", !assistencia24h);
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Assistência 24h</p>
            <p className="text-sm text-gray-500">Assistência 24h em todo o território nacional.</p>
          </div>
          {/* Ícone SVG à direita */}
          <div className="flex items-center space-x-2">
            <ClickSvgIcon className={`${assistencia24h ? "fill-white" : "fill-[#87A644]"}`} />
          </div>
        </div>
      </div>

      {/* Preço Final e Botão */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">Valor da mensalidade</p>
        <p className="text-4xl font-bold text-gray-800">R${valorMensal.toFixed(2)}/mês</p>
        <p className="text-sm text-gray-600 mb-4">Valor de ativação única: R$299,90</p>
        <button className="bg-[#87A644] text-white px-6 py-6 rounded-lg hover:bg-green-600 mt-10 w-full" type="submit">
          Faça uma cotação agora!
        </button>
      </div>
    </form>
  );
}
