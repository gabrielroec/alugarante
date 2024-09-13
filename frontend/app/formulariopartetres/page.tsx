"use client";
import ClickSvgIcon from "@/assets/ClickIcon";
import LandingPageHeaderForm from "@/components/LandingPageHeaderForm";
import { Button } from "@/components/ui/button";
import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FourthForm = () => {
  const router = useRouter();
  const [dadosFormulario, setDadosFormulario] = useState<any>(null);
  const [dadosLocatario, setDadosLocatario] = useState("Nao");
  const [locatarioPessoaJuridica, setLocatarioPessoaJuridica] = useState("Nao");
  const [isLocatario, setIsLocatario] = useState(false);
  const [isLocatarioPessoaJuridica, setIsLocatarioPessoaJuridica] = useState(false);

  // Variáveis do locatário
  const [locatarioNomeCompleto, setLocatarioNomeCompleto] = useState("");
  const [locatarioEmail, setLocatarioEmail] = useState("");
  const [locatarioTelefone, setLocatarioTelefone] = useState("");
  const [locatarioNacionalidade, setLocatarioNacionalidade] = useState("");
  const [locatarioNaturalidade, setLocatarioNaturalidade] = useState("");
  const [locatarioEstadoCivil, setLocatarioEstadoCivil] = useState("");
  const [locatarioDataNascimento, setLocatarioDataNascimento] = useState("");
  const [locatarioCpf, setLocatarioCpf] = useState("");
  const [locatarioRg, setLocatarioRg] = useState("");
  const [locatarioOrgaoExpedidor, setLocatarioOrgaoExpedidor] = useState("");
  const [locatarioCep, setLocatarioCep] = useState("");
  const [locatarioEstado, setLocatarioEstado] = useState("");
  const [locatarioBairro, setLocatarioBairro] = useState("");
  const [locatarioEndereco, setLocatarioEndereco] = useState("");
  const [locatarioNumero, setLocatarioNumero] = useState("");
  const [locatarioComplemento, setLocatarioComplemento] = useState("");
  const [locatarioCnpj, setLocatarioCnpj] = useState("");
  const [locatarioRazaoSocial, setLocatarioRazaoSocial] = useState("");

  useEffect(() => {
    const dados = localStorage.getItem("dadosFormulario");
    if (dados) {
      setDadosFormulario(JSON.parse(dados));
    }
  }, []);

  useEffect(() => {
    console.log("Dados recuperados:", dadosFormulario);
  }, [dadosFormulario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novosDados = {
      dadosLocatario,
      locatarioPessoaJuridica,
      locatarioCnpj: isLocatarioPessoaJuridica ? locatarioCnpj : null,
      locatarioRazaoSocial: isLocatarioPessoaJuridica ? locatarioRazaoSocial : null,
      locatarioNomeCompleto,
      locatarioEmail,
      locatarioTelefone,
      locatarioNacionalidade,
      locatarioNaturalidade,
      locatarioEstadoCivil,
      locatarioDataNascimento,
      locatarioCpf,
      locatarioRg,
      locatarioOrgaoExpedidor,
      locatarioCep,
      locatarioEstado,
      locatarioBairro,
      locatarioEndereco,
      locatarioNumero,
      locatarioComplemento,
    };

    const dadosAtualizados = {
      ...dadosFormulario,
      ...novosDados,
    };

    localStorage.setItem("dadosFormularioCompleto", JSON.stringify(dadosAtualizados));
    console.log("Dados atualizados do formulário:", dadosAtualizados);

    setTimeout(() => {
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
              <div className="bg-[#87A644] text-white w-[70px] h-[70px] rounded-full flex justify-center items-center">3</div>
              <span className="ml-2">Dados do locatário</span>
            </div>
            <div className="bar absolute w-[85%] h-[4px] bg-[#ccc] top-[37%] right-[50%] translate-x-[50%]">
              <div className="absolute w-[100%] h-full left-0 bg-[#87A644]"></div>
            </div>
          </div>

          <form className="flex flex-wrap gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col w-full">
              <label className="block mb-2">Já tem os dados do locatário?</label>
              <div className="relative">
                <select
                  value={dadosLocatario}
                  className="w-full border border-[#ccc] appearance-none rounded-2xl px-10 py-4"
                  onChange={(e) => {
                    setDadosLocatario(e.target.value);
                    setIsLocatario(e.target.value === "Sim");
                  }}
                >
                  <option value="Nao">Não</option>
                  <option value="Sim">Sim</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ClickSvgIcon className="fill-[#87A644] ml-[10px]" />
                </div>
              </div>
            </div>

            {isLocatario && (
              <>
                <div className="flex flex-col w-full">
                  <label className="block mb-2">É pessoa jurídica?</label>
                  <div className="relative">
                    <select
                      value={locatarioPessoaJuridica}
                      className="w-full border border-[#ccc] appearance-none rounded-2xl px-10 py-4"
                      onChange={(e) => {
                        setLocatarioPessoaJuridica(e.target.value);
                        setIsLocatarioPessoaJuridica(e.target.value === "Sim");
                      }}
                    >
                      <option value="Nao">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <ClickSvgIcon className="fill-[#87A644] ml-[10px]" />
                    </div>
                  </div>
                </div>

                {isLocatarioPessoaJuridica && (
                  <div className="flex w-full gap-4">
                    <div className="w-full">
                      <label className="block mb-2">CNPJ</label>
                      <input
                        type="text"
                        value={locatarioCnpj}
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        placeholder="Digite o CNPJ"
                        onChange={(e) => setLocatarioCnpj(e.target.value)}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2">Razão Social</label>
                      <input
                        type="text"
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        placeholder="Digite a Razão Social"
                        value={locatarioRazaoSocial}
                        onChange={(e) => setLocatarioRazaoSocial(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col w-full">
                  <label className="block mb-2">Nome completo</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite o nome completo"
                    value={locatarioNomeCompleto}
                    onChange={(e) => setLocatarioNomeCompleto(e.target.value)}
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mb-2">E-mail</label>
                  <input
                    type="email"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite o e-mail"
                    value={locatarioEmail}
                    onChange={(e) => setLocatarioEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mb-2">Telefone</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite o telefone"
                    value={locatarioTelefone}
                    onChange={(e) => setLocatarioTelefone(e.target.value)}
                  />
                </div>

                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">Nacionalidade</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite a nacionalidade"
                      value={locatarioNacionalidade}
                      onChange={(e) => setLocatarioNacionalidade(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2">Naturalidade</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite a naturalidade"
                      value={locatarioNaturalidade}
                      onChange={(e) => setLocatarioNaturalidade(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">Estado Civil</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o estado civil"
                      value={locatarioEstadoCivil}
                      onChange={(e) => setLocatarioEstadoCivil(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2">Data de nascimento</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="DD-MM-AAAA"
                      value={locatarioDataNascimento}
                      onChange={(e) => setLocatarioDataNascimento(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">CPF</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o CPF"
                      value={locatarioCpf}
                      onChange={(e) => setLocatarioCpf(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2">RG</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o RG"
                      value={locatarioRg}
                      onChange={(e) => setLocatarioRg(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2">Orgão Expedidor</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Sigla"
                      value={locatarioOrgaoExpedidor}
                      onChange={(e) => setLocatarioOrgaoExpedidor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">CEP</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o CEP"
                      value={locatarioCep}
                      onChange={(e) => setLocatarioCep(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2">Estado</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o estado"
                      value={locatarioEstado}
                      onChange={(e) => setLocatarioEstado(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">Bairro</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o bairro"
                      value={locatarioBairro}
                      onChange={(e) => setLocatarioBairro(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2">Endereço</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o endereço"
                      value={locatarioEndereco}
                      onChange={(e) => setLocatarioEndereco(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">Número</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o número"
                      value={locatarioNumero}
                      onChange={(e) => setLocatarioNumero(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2">Complemento</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o complemento"
                      value={locatarioComplemento}
                      onChange={(e) => setLocatarioComplemento(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-span-2 flex justify-end">
                  <Button type="submit">Enviar</Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default FourthForm;
