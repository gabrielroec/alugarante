"use client";
import ClickSvgIcon from "@/assets/ClickIcon";
import LandingPageHeaderForm from "@/components/LandingPageHeaderForm";
import { Button } from "@/components/ui/button";
import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ThirdForm = () => {
  const router = useRouter();
  // Estado para armazenar os dados do localStorage
  const [dadosFormulario, setDadosFormulario] = useState<any>(null);

  // Estados para capturar os novos dados preenchidos no ThirdForm
  const [finalidade, setFinalidade] = useState("Aluguel");
  const [iptu, setIptu] = useState("Pago 2024");
  const [agua, setAgua] = useState("");
  const [gas, setGas] = useState("");
  const [valorAluguel, setValorAluguel] = useState("");
  const [valorCondominio, setValorCondominio] = useState("");
  const [valorIptu, setValorIptu] = useState("");
  const [telefoneAdm, setTelefoneAdm] = useState("");
  const [cepImovel, setCepImovel] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [numero, setNumero] = useState("");

  useEffect(() => {
    // Recuperar os dados do localStorage ao montar o componente
    const dados = localStorage.getItem("dadosFormulario");
    if (dados) {
      setDadosFormulario(JSON.parse(dados)); // Armazenar os dados recuperados no estado
    }
  }, []);

  useEffect(() => {
    // Exibir o valor atualizado de dadosFormulario após a atualização do estado
  }, [dadosFormulario]); // Executa o console.log sempre que dadosFormulario for atualizado

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Dados preenchidos no ThirdForm
    const novosDados = {
      finalidade,
      valorAluguel,
      valorCondominio,
      valorIptu,
      agua,
      gas,
      telefoneAdm,
      cepImovel,
      cidade,
      estado,
      bairro,
      endereco,
      numero,
      complemento,
    };

    // Combinar os dados recuperados do SecondForm (localStorage) com os dados do ThirdForm
    const dadosAtualizados = {
      ...dadosFormulario, // Dados do SecondForm
      ...novosDados, // Dados do ThirdForm
    };
    console.log(novosDados);
    // Atualizar o localStorage com os dados combinados
    localStorage.setItem("dadosFormulario", JSON.stringify(dadosAtualizados));

    setTimeout(() => {
      // Redirecionar para a próxima página usando o router do next
      router.push("/formulariopartetres");
    }, 100);
  };

  return (
    <Fragment>
      <LandingPageHeaderForm />
      <div className="min-h-screen flex flex-col items-center mt-10 ">
        <div className="w-full max-w-4xl ">
          <div className="flex justify-between items-center mb-6 relative">
            <div className="relative z-10 flex items-center flex-col">
              <div className="bg-[#87A644] text-white w-[70px] h-[70px] rounded-full flex justify-center items-center">1</div>
              <span className="ml-2">Dados do proprietário</span>
            </div>
            <div className="relative z-10 flex items-center flex-col">
              <div className="bg-[#87A644] text-white w-[70px] h-[70px] rounded-full flex justify-center items-center">2</div>
              <span className="ml-2">Informações do imóvel</span>
            </div>
            <div className="relative z-10 flex items-center flex-col">
              <div className="bg-[#ccc] text-white w-[70px] h-[70px] rounded-full flex justify-center items-center">3</div>
              <span className="ml-2">Dados do locatário</span>
            </div>
            <div className="bar absolute w-[85%] h-[4px] bg-[#ccc] top-[37%] right-[50%] translate-x-[50%]">
              <div className="absolute w-[50%] h-full left-0 bg-[#87A644]"></div>
            </div>
          </div>

          <form className="flex flex-wrap gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col w-full">
              <label className="block mb-2">Finalidade do imóvel</label>
              <div className="relative">
                <select
                  value={finalidade}
                  className="w-full border border-[#ccc] appearance-none rounded-2xl px-10 py-4"
                  onChange={(e) => setFinalidade(e.target.value)}
                >
                  <option value="Alugar">Alugar</option>
                  <option value="Vender">Vender</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ClickSvgIcon className="fill-[#87A644] ml-[10px]" />
                </div>
              </div>
            </div>
            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Valor do aluguel</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o valor do aluguel (Ex: 1200)"
                  value={valorAluguel}
                  onChange={(e) => setValorAluguel(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2">Valor do condomínio</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o valor do condomínio (Ex: 150)"
                  value={valorCondominio}
                  onChange={(e) => setValorCondominio(e.target.value)}
                />
              </div>
            </div>
            <div className="flex w-full gap-4">
              <div className="flex flex-col w-full">
                <label className="block mb-2">IPTU</label>
                <div className="relative">
                  <select
                    value={iptu}
                    className="w-full border border-[#ccc] appearance-none rounded-2xl px-10 py-4"
                    onChange={(e) => setIptu(e.target.value)}
                  >
                    <option value="Pago 2024">Pago 2024</option>
                    <option value="Não pago 2024">Não pago 2024</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ClickSvgIcon className="fill-[#87A644] ml-[10px]" />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <label className="block mb-2">Valor do IPTU</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o valor do condomínio (Ex: 150)"
                  value={valorIptu}
                  onChange={(e) => setValorIptu(e.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Valor da agua</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o valor da água (Ex: 150)"
                  value={agua}
                  onChange={(e) => setAgua(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-full">
                <div className="w-full">
                  <label className="block mb-2">Valor do Gás</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                    placeholder="Digite o valor do gás (Ex: 150)"
                    value={gas}
                    onChange={(e) => setGas(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Administrador do Condomínio e Telefone</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Nome e Telefone"
                  value={telefoneAdm}
                  onChange={(e) => setTelefoneAdm(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2">CEP</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o CEP do imóvel"
                  value={cepImovel}
                  onChange={(e) => setCepImovel(e.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Cidade</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite a cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2">Estado</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o seu estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Bairro</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o seu bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2">Endereço</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o seu Endereço"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Número</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o número"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2">Complemento</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o complemento"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>
            </div>

            <div className="col-span-2 flex justify-end">
              <Button type="submit">Enviar</Button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ThirdForm;
