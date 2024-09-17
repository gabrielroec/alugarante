"use client";
import ClickSvgIcon from "@/assets/ClickIcon";
import LandingPageHeaderForm from "@/components/LandingPageHeaderForm";
import { Button } from "@/components/ui/button";
import React, { Fragment, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api";

const FourthForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Para pegar o cardId da URL
  const { toast } = useToast();

  const [cardId, setCardId] = useState<number | null>(null);

  useEffect(() => {
    const idFromParams = searchParams.get("cardId");

    console.log("ID from URL parameters:", idFromParams); // Verifique se o ID está sendo capturado

    if (!idFromParams) {
      toast({
        title: "Erro",
        description: "ID do card não encontrado. Redirecionando para o início.",
        variant: "destructive",
      });
      router.push("/"); // Redireciona para outra página
    } else {
      setCardId(parseInt(idFromParams)); // Armazena o cardId no estado
    }
  }, [router, searchParams, toast]);

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

  // Variáveis para arquivos anexados
  const [anexoCpfRgMotoristaLocatario, setAnexoCpfRgMotoristaLocatario] = useState<File | undefined>(undefined);
  const [anexoEstadoCivilLocatario, setAnexoEstadoCivilLocatario] = useState<File | undefined>(undefined);
  const [anexoResidenciaLocatario, setAnexoResidenciaLocatario] = useState<File | undefined>(undefined);
  const [anexoContratoSocialLocatario, setAnexoContratoSocialLocatario] = useState<File | undefined>(undefined);
  const [anexoUltimoBalancoLocatario, setAnexoUltimoBalancoLocatario] = useState<File | undefined>(undefined);

  // Função de envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locatarioNomeCompleto || !locatarioEmail || !locatarioTelefone) {
      toast({
        title: "Erro no envio",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!cardId) {
      toast({
        title: "Erro no envio",
        description: "ID do card não está disponível.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("cardId", cardId.toString());
    formData.append("tipoPessoa", isLocatarioPessoaJuridica ? "Jurídica" : "Física");
    formData.append("nomeCompleto", locatarioNomeCompleto);
    formData.append("email", locatarioEmail);
    formData.append("telefone", locatarioTelefone);
    formData.append("nacionalidade", locatarioNacionalidade);
    formData.append("naturalidade", locatarioNaturalidade);
    formData.append("estadoCivil", locatarioEstadoCivil);
    formData.append("dataNascimento", locatarioDataNascimento);
    formData.append("cpf", locatarioCpf || "");
    formData.append("rg", locatarioRg || "");
    formData.append("orgaoExpedidor", locatarioOrgaoExpedidor || "");
    formData.append("cnpj", locatarioCnpj || "");
    formData.append("razaoSocial", locatarioRazaoSocial || "");
    formData.append("cep", locatarioCep);
    formData.append("estado", locatarioEstado);
    formData.append("bairro", locatarioBairro);
    formData.append("endereco", locatarioEndereco);
    formData.append("numero", locatarioNumero);
    formData.append("complemento", locatarioComplemento || "");

    // Adiciona os arquivos se eles existirem
    if (anexoCpfRgMotoristaLocatario) formData.append("anexoCpfRgMotoristaLocatario", anexoCpfRgMotoristaLocatario);
    if (anexoEstadoCivilLocatario) formData.append("anexoEstadoCivilLocatario", anexoEstadoCivilLocatario);
    if (anexoResidenciaLocatario) formData.append("anexoResidenciaLocatario", anexoResidenciaLocatario);
    if (anexoContratoSocialLocatario) formData.append("anexoContratoSocialLocatario", anexoContratoSocialLocatario);
    if (anexoUltimoBalancoLocatario) formData.append("anexoUltimoBalancoLocatario", anexoUltimoBalancoLocatario);

    try {
      // Enviar os dados para a rota do backend
      const response = await api.post("/saveLocatarioToCard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Exibir toast de sucesso
      toast({
        title: "Formulário enviado",
        description: "Os dados do imóvel foram salvos com sucesso.",
        variant: "default",
      });

      // Redirecionar para o próximo formulário (locatário)
      setTimeout(() => {
        router.push(`/`);
      }, 100);
    } catch (error) {
      // Exibir toast de erro
      toast({
        title: "Erro no envio",
        description: "Ocorreu um erro ao enviar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  return (
    <Fragment>
      <LandingPageHeaderForm />
      <div className="min-h-screen flex flex-col items-center mt-10 ">
        <div className="w-full max-w-4xl ">
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
                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">Estado Civil</label>
                    <div className="relative">
                      <select
                        value={locatarioEstadoCivil}
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        onChange={(e) => setLocatarioEstadoCivil(e.target.value)}
                      >
                        <option value="">Selecione o estado civil</option>
                        <option value="Solteiro">Solteiro</option>
                        <option value="Casado">Casado</option>
                        <option value="Divorciado">Divorciado</option>
                        <option value="Viúvo">Viúvo</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <ClickSvgIcon className="fill-[#87A644] ml-[10px]" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block mb-2">Data de Nascimento</label>
                    <input
                      type="date"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      value={locatarioDataNascimento}
                      onChange={(e) => setLocatarioDataNascimento(e.target.value)}
                    />
                  </div>
                </div>

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

                {/* Adicionando mais campos obrigatórios */}
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

                {/* Campos de upload de arquivo */}
                <div className="w-full">
                  <label className="block mb-2">Anexar CPF/RG</label>
                  <input
                    type="file"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    accept="image/*,application/pdf"
                    onChange={(e) => setAnexoCpfRgMotoristaLocatario(e.target.files ? e.target.files[0] : undefined)}
                  />
                </div>

                <div className="w-full">
                  <label className="block mb-2">Anexar Comprovante de Estado Civil</label>
                  <input
                    type="file"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    accept="image/*,application/pdf"
                    onChange={(e) => setAnexoEstadoCivilLocatario(e.target.files ? e.target.files[0] : undefined)}
                  />
                </div>

                <div className="w-full">
                  <label className="block mb-2">Anexar Comprovante de Residência</label>
                  <input
                    type="file"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    accept="image/*,application/pdf"
                    onChange={(e) => setAnexoResidenciaLocatario(e.target.files ? e.target.files[0] : undefined)}
                  />
                </div>

                {isLocatarioPessoaJuridica && (
                  <>
                    <div className="w-full">
                      <label className="block mb-2">Anexar Contrato Social</label>
                      <input
                        type="file"
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        accept="image/*,application/pdf"
                        onChange={(e) => setAnexoContratoSocialLocatario(e.target.files ? e.target.files[0] : undefined)}
                      />
                    </div>

                    <div className="w-full">
                      <label className="block mb-2">Anexar Último Balanço</label>
                      <input
                        type="file"
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        accept="image/*,application/pdf"
                        onChange={(e) => setAnexoUltimoBalancoLocatario(e.target.files ? e.target.files[0] : undefined)}
                      />
                    </div>
                  </>
                )}

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
