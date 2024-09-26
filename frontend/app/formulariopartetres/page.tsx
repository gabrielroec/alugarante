"use client";
import ClickSvgIcon from "@/assets/ClickIcon";
import LandingPageHeaderForm from "@/components/LandingPageHeaderForm";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api";

// Funções Utilitárias para Validação
const isValidCEP = (cep: string): boolean => /^\d{8}$/.test(cep);
const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10))) return false;

  return true;
};
const isValidCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  const digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length += 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
};

const FourthForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Para pegar o cardId da URL
  const { toast } = useToast();

  const [cardId, setCardId] = useState<number | null>(null);

  // Estados para capturar os dados de Locatário
  const [dadosLocatario, setDadosLocatario] = useState("Nao");
  const [isLocatario, setIsLocatario] = useState(false);
  const [locatarioPessoaJuridica, setLocatarioPessoaJuridica] = useState("Nao");
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
  const [locatarioCidade, setLocatarioCidade] = useState("");

  // Variáveis para arquivos anexados
  const [anexoCpfRgMotoristaLocatario, setAnexoCpfRgMotoristaLocatario] = useState<File | undefined>(undefined);
  const [anexoEstadoCivilLocatario, setAnexoEstadoCivilLocatario] = useState<File | undefined>(undefined);
  const [anexoResidenciaLocatario, setAnexoResidenciaLocatario] = useState<File | undefined>(undefined);
  const [anexoContratoSocialLocatario, setAnexoContratoSocialLocatario] = useState<File | undefined>(undefined);
  const [anexoUltimoBalancoLocatario, setAnexoUltimoBalancoLocatario] = useState<File | undefined>(undefined);

  // Estado para controlar a submissão do formulário
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect para obter o cardId dos parâmetros da URL
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

  /**
   * Função para buscar CEP e auto-preencher campos de endereço.
   * Utiliza a API ViaCEP para obter os dados do endereço.
   * @param cep - CEP a ser buscado.
   */
  const buscarCep = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast({
          title: "CEP inválido",
          description: "Por favor, insira um CEP válido.",
          variant: "destructive",
        });
        return;
      }

      setLocatarioEndereco(data.logradouro || "");
      setLocatarioBairro(data.bairro || "");
      setLocatarioCidade(data.localidade || "");
      setLocatarioEstado(data.uf || "");
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar o CEP. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  /**
   * Manipulador de mudança do CEP.
   * Limita a entrada a 8 dígitos e chama a função de busca quando válido.
   * @param e - Evento de mudança no input de CEP.
   */
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cep = e.target.value.replace(/\D/g, "").substring(0, 8); // Remove não dígitos e limita a 8 caracteres
    setLocatarioCep(cep);
    if (cep.length === 8 && isValidCEP(cep)) {
      buscarCep(cep);
    }
  };

  /**
   * Função para resetar todos os campos do locatário.
   */
  const resetLocatarioFields = () => {
    setLocatarioPessoaJuridica("Nao");
    setIsLocatarioPessoaJuridica(false);
    setLocatarioCnpj("");
    setLocatarioRazaoSocial("");
    setLocatarioNomeCompleto("");
    setLocatarioEmail("");
    setLocatarioTelefone("");
    setLocatarioNacionalidade("");
    setLocatarioNaturalidade("");
    setLocatarioEstadoCivil("");
    setLocatarioDataNascimento("");
    setLocatarioCpf("");
    setLocatarioRg("");
    setLocatarioOrgaoExpedidor("");
    setLocatarioCep("");
    setLocatarioEstado("");
    setLocatarioBairro("");
    setLocatarioEndereco("");
    setLocatarioNumero("");
    setLocatarioComplemento("");
    setLocatarioCidade("");
    setAnexoCpfRgMotoristaLocatario(undefined);
    setAnexoEstadoCivilLocatario(undefined);
    setAnexoResidenciaLocatario(undefined);
    setAnexoContratoSocialLocatario(undefined);
    setAnexoUltimoBalancoLocatario(undefined);
  };

  /**
   * Função para lidar com o envio do formulário.
   * Realiza todas as validações necessárias antes de enviar os dados.
   * @param e - Evento de submissão do formulário.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Evita submissões múltiplas

    setIsSubmitting(true); // Inicia a submissão

    // Verificar se o cardId está disponível
    if (!cardId) {
      toast({
        title: "Erro no envio",
        description: "ID do card não está disponível.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Se o usuário selecionou "Sim" para "Já tem os dados do locatário?"
    if (isLocatario) {
      // Validação dos campos obrigatórios do locatário

      const camposObrigatoriosLocatario = [
        "nomeCompleto",
        "email",
        "telefone",
        "nacionalidade",
        "naturalidade",
        "estadoCivil",
        "cep",
        "estado",
        "bairro",
        "endereco",
        "numero",
      ];

      const camposPreenchidosLocatario = camposObrigatoriosLocatario.every(
        (campo) =>
          (campo === "nomeCompleto" && locatarioNomeCompleto.trim() !== "") ||
          (campo === "email" && locatarioEmail.trim() !== "") ||
          (campo === "telefone" && locatarioTelefone.trim() !== "") ||
          (campo === "nacionalidade" && locatarioNacionalidade.trim() !== "") ||
          (campo === "naturalidade" && locatarioNaturalidade.trim() !== "") ||
          (campo === "estadoCivil" && locatarioEstadoCivil.trim() !== "") ||
          (campo === "cep" && locatarioCep.trim() !== "") ||
          (campo === "estado" && locatarioEstado.trim() !== "") ||
          (campo === "bairro" && locatarioBairro.trim() !== "") ||
          (campo === "endereco" && locatarioEndereco.trim() !== "") ||
          (campo === "numero" && locatarioNumero.trim() !== "")
      );

      if (!camposPreenchidosLocatario) {
        toast({
          title: "Erro no envio",
          description: "Por favor, preencha todos os campos obrigatórios do locatário.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validação de Formato do E-mail
      if (!isValidEmail(locatarioEmail)) {
        toast({
          title: "E-mail inválido",
          description: "Por favor, insira um e-mail válido.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validação de CEP
      if (!isValidCEP(locatarioCep)) {
        toast({
          title: "CEP inválido",
          description: "Por favor, insira um CEP válido com 8 dígitos.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validação de CPF ou CNPJ
      if (isLocatarioPessoaJuridica) {
        if (!locatarioCnpj.trim() || !locatarioRazaoSocial.trim()) {
          toast({
            title: "Erro no envio",
            description: "Por favor, preencha os campos de CNPJ e Razão Social.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        if (!isValidCNPJ(locatarioCnpj)) {
          toast({
            title: "CNPJ inválido",
            description: "Por favor, insira um CNPJ válido.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        if (!locatarioCpf.trim() || !locatarioRg.trim() || !locatarioOrgaoExpedidor.trim()) {
          toast({
            title: "Erro no envio",
            description: "Por favor, preencha os campos de CPF, RG e Órgão Expedidor.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        if (!isValidCPF(locatarioCpf)) {
          toast({
            title: "CPF inválido",
            description: "Por favor, insira um CPF válido.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        if (locatarioRg.trim().length < 5) {
          // Exemplo de validação simples
          toast({
            title: "RG inválido",
            description: "Por favor, insira um RG válido.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Validação dos Anexos Obrigatórios para locatário
      if (!anexoCpfRgMotoristaLocatario) {
        toast({
          title: "Erro no envio",
          description: "Por favor, anexe o CPF/RG do locatário.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!anexoEstadoCivilLocatario) {
        toast({
          title: "Erro no envio",
          description: "Por favor, anexe o comprovante de estado civil do locatário.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!anexoResidenciaLocatario) {
        toast({
          title: "Erro no envio",
          description: "Por favor, anexe o comprovante de residência do locatário.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (isLocatarioPessoaJuridica) {
        if (!anexoContratoSocialLocatario) {
          toast({
            title: "Erro no envio",
            description: "Por favor, anexe o contrato social do locatário.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        if (!anexoUltimoBalancoLocatario) {
          toast({
            title: "Erro no envio",
            description: "Por favor, anexe o último balanço do locatário.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }
    }

    try {
      const formData = new FormData();
      formData.append("cardId", cardId.toString());

      // Adicionar dados do locatário apenas se isLocatario for true
      if (isLocatario) {
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
        formData.append("cidade", locatarioCidade);

        // Adiciona os arquivos obrigatórios
        if (anexoCpfRgMotoristaLocatario) {
          formData.append("anexoCpfRgMotoristaLocatario", anexoCpfRgMotoristaLocatario);
        }
        if (anexoEstadoCivilLocatario) {
          formData.append("anexoEstadoCivilLocatario", anexoEstadoCivilLocatario);
        }
        if (anexoResidenciaLocatario) {
          formData.append("anexoResidenciaLocatario", anexoResidenciaLocatario);
        }

        if (isLocatarioPessoaJuridica) {
          if (anexoContratoSocialLocatario) {
            formData.append("anexoContratoSocialLocatario", anexoContratoSocialLocatario);
          }
          if (anexoUltimoBalancoLocatario) {
            formData.append("anexoUltimoBalancoLocatario", anexoUltimoBalancoLocatario);
          }
        }
      }

      // Enviar os dados para a rota do backend
      const response = await api.post("/saveLocatarioToCard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Exibir toast de sucesso
      toast({
        title: "Formulário enviado",
        description: "Os dados foram salvos com sucesso.",
        variant: "default",
      });

      // Redirecionar para a página inicial ou próxima etapa
      setTimeout(() => {
        router.push(`/`);
      }, 100);
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      toast({
        title: "Erro no envio",
        description: "Ocorreu um erro ao enviar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Finaliza a submissão
    }
  };

  return (
    <>
      <LandingPageHeaderForm />
      <div className="min-h-screen flex flex-col items-center mt-10">
        <div className="w-full max-w-4xl">
          <form className="flex flex-wrap gap-4" onSubmit={handleSubmit}>
            {/* Pergunta sobre os dados do locatário */}
            <div className="flex flex-col w-full">
              <label className="block mb-2">Já tem os dados do locatário?</label>
              <div className="relative">
                <select
                  value={dadosLocatario}
                  className="w-full border border-[#ccc] appearance-none rounded-2xl px-10 py-4"
                  onChange={(e) => {
                    setDadosLocatario(e.target.value);
                    setIsLocatario(e.target.value === "Sim");
                    // Resetar campos do locatário quando selecionado "Não"
                    if (e.target.value !== "Sim") {
                      resetLocatarioFields();
                    }
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

            {/* Renderização Condicional dos Campos do Locatário */}
            {isLocatario && (
              <>
                {/* Pergunta sobre Pessoa Jurídica */}
                <div className="flex flex-col w-full">
                  <label className="block mb-2">É pessoa jurídica?</label>
                  <div className="relative">
                    <select
                      value={locatarioPessoaJuridica}
                      className="w-full border border-[#ccc] appearance-none rounded-2xl px-10 py-4"
                      onChange={(e) => {
                        setLocatarioPessoaJuridica(e.target.value);
                        setIsLocatarioPessoaJuridica(e.target.value === "Sim");
                        // Resetar campos específicos quando selecionado "Não"
                        if (e.target.value !== "Sim") {
                          setLocatarioCnpj("");
                          setLocatarioRazaoSocial("");
                        }
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

                {/* Campos para Pessoa Jurídica ou Física */}
                {isLocatarioPessoaJuridica ? (
                  <div className="flex w-full gap-4">
                    <div className="w-full">
                      <label className="block mb-2">
                        CNPJ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={locatarioCnpj}
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        placeholder="Digite o CNPJ"
                        onChange={(e) => setLocatarioCnpj(e.target.value)}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2">
                        Razão Social <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        placeholder="Digite a Razão Social"
                        value={locatarioRazaoSocial}
                        onChange={(e) => setLocatarioRazaoSocial(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  // Campos para Pessoa Física
                  <div className="flex w-full gap-4">
                    <div className="w-full">
                      <label className="block mb-2">
                        CPF <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        placeholder="Digite o CPF"
                        value={locatarioCpf}
                        onChange={(e) => setLocatarioCpf(e.target.value)}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2">
                        RG <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        placeholder="Digite o RG"
                        value={locatarioRg}
                        onChange={(e) => setLocatarioRg(e.target.value)}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2">
                        Órgão Expedidor <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        placeholder="Sigla"
                        value={locatarioOrgaoExpedidor}
                        onChange={(e) => setLocatarioOrgaoExpedidor(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Estado Civil e Data de Nascimento */}
                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">
                      Estado Civil <span className="text-red-500">*</span>
                    </label>
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
                    <label className="block mb-2">
                      Data de Nascimento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      value={locatarioDataNascimento}
                      onChange={(e) => setLocatarioDataNascimento(e.target.value)} // Certifique-se de que o valor seja uma string de data
                    />
                  </div>
                </div>

                {/* Nome Completo */}
                <div className="flex flex-col w-full">
                  <label className="block mb-2">
                    Nome completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite o nome completo"
                    value={locatarioNomeCompleto}
                    onChange={(e) => setLocatarioNomeCompleto(e.target.value)}
                  />
                </div>

                {/* E-mail */}
                <div className="flex flex-col w-full">
                  <label className="block mb-2">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite o e-mail"
                    value={locatarioEmail}
                    onChange={(e) => setLocatarioEmail(e.target.value)}
                  />
                </div>

                {/* Telefone */}
                <div className="flex flex-col w-full">
                  <label className="block mb-2">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite o telefone"
                    value={locatarioTelefone}
                    onChange={(e) => setLocatarioTelefone(e.target.value)}
                  />
                </div>

                {/* Nacionalidade e Naturalidade */}
                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">
                      Nacionalidade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite a nacionalidade"
                      value={locatarioNacionalidade}
                      onChange={(e) => setLocatarioNacionalidade(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2">
                      Naturalidade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite a naturalidade"
                      value={locatarioNaturalidade}
                      onChange={(e) => setLocatarioNaturalidade(e.target.value)}
                    />
                  </div>
                </div>

                {/* CEP */}
                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">
                      CEP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o CEP"
                      value={locatarioCep}
                      onChange={handleCepChange}
                    />
                  </div>
                </div>

                {/* Cidade e Estado */}
                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">
                      Cidade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite a cidade"
                      value={locatarioCidade}
                      onChange={(e) => setLocatarioCidade(e.target.value)}
                      readOnly // Campo preenchido automaticamente
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2">
                      Estado <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o estado"
                      value={locatarioEstado}
                      onChange={(e) => setLocatarioEstado(e.target.value)}
                      readOnly // Campo preenchido automaticamente
                    />
                  </div>
                </div>

                {/* Bairro e Endereço */}
                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">
                      Bairro <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o bairro"
                      value={locatarioBairro}
                      onChange={(e) => setLocatarioBairro(e.target.value)}
                      readOnly // Campo preenchido automaticamente
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2">
                      Endereço <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                      placeholder="Digite o endereço"
                      value={locatarioEndereco}
                      onChange={(e) => setLocatarioEndereco(e.target.value)}
                      readOnly // Campo preenchido automaticamente
                    />
                  </div>
                </div>

                {/* Número e Complemento */}
                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">
                      Número <span className="text-red-500">*</span>
                    </label>
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

                {/* Campos de upload de arquivo obrigatórios */}
                {isLocatario && (
                  <>
                    <div className="w-full">
                      <label className="block mb-2">
                        Anexar CPF/RG <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        accept="image/*,application/pdf"
                        onChange={(e) => setAnexoCpfRgMotoristaLocatario(e.target.files ? e.target.files[0] : undefined)}
                      />
                    </div>

                    <div className="w-full">
                      <label className="block mb-2">
                        Anexar Comprovante de Estado Civil <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        accept="image/*,application/pdf"
                        onChange={(e) => setAnexoEstadoCivilLocatario(e.target.files ? e.target.files[0] : undefined)}
                      />
                    </div>

                    <div className="w-full">
                      <label className="block mb-2">
                        Anexar Comprovante de Residência <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        accept="image/*,application/pdf"
                        onChange={(e) => setAnexoResidenciaLocatario(e.target.files ? e.target.files[0] : undefined)}
                      />
                    </div>

                    {/* Campos de upload de arquivo para Pessoa Jurídica */}
                    {isLocatarioPessoaJuridica && (
                      <>
                        <div className="w-full">
                          <label className="block mb-2">
                            Anexar Contrato Social <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                            accept="image/*,application/pdf"
                            onChange={(e) => setAnexoContratoSocialLocatario(e.target.files ? e.target.files[0] : undefined)}
                          />
                        </div>

                        <div className="w-full">
                          <label className="block mb-2">
                            Anexar Último Balanço <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                            accept="image/*,application/pdf"
                            onChange={(e) => setAnexoUltimoBalancoLocatario(e.target.files ? e.target.files[0] : undefined)}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
                {/* Campos de upload de arquivo para Pessoa Jurídica */}
                {isLocatarioPessoaJuridica && (
                  <>
                    <div className="w-full">
                      <label className="block mb-2">
                        Anexar Contrato Social <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        accept="image/*,application/pdf"
                        onChange={(e) => setAnexoContratoSocialLocatario(e.target.files ? e.target.files[0] : undefined)}
                      />
                    </div>

                    <div className="w-full">
                      <label className="block mb-2">
                        Anexar Último Balanço <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                        accept="image/*,application/pdf"
                        onChange={(e) => setAnexoUltimoBalancoLocatario(e.target.files ? e.target.files[0] : undefined)}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Botão de Envio */}
            <div className="w-full flex justify-end">
              <Button type="submit" className="py-3 px-6 bg-[#87A644] hover:bg-[#5b702e] text-white rounded-lg" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FourthForm;
