"use client";
import ClickSvgIcon from "@/assets/ClickIcon";
import LandingPageHeaderForm from "@/components/LandingPageHeaderForm";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation"; // Atualizando os imports
import React, { Fragment, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api";

// Funções Utilitárias para Validação
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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

const SecondForm = () => {
  // Removido o cardId como prop
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cardId, setCardId] = useState<number | null>(null); // Estado para armazenar o cardId

  const [isPessoaJuridica, setIsPessoaJuridica] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("Pessoa física");
  const [estadoCivil, setEstadoCivil] = useState("Solteiro");
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [isCasado, setIsCasado] = useState(false);
  const [cpfConjuge, setCpfConjuge] = useState("");
  const [rgConjuge, setRgConjuge] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeCompletoConjuge, setNomeCompletoConjuge] = useState("");
  const [email, setEmail] = useState("");
  const [emailConjuge, setEmailConjuge] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefoneConjuge, setTelefoneConjuge] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  const [nacionalidadeConjuge, setNacionalidadeConjuge] = useState("");
  const [naturalidade, setNaturalidade] = useState("");
  const [naturalidadeConjuge, setNaturalidadeConjuge] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [dataNascimentoConjuge, setDataNascimentoConjuge] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [orgaoExpedidor, setOrgaoExpedidor] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [anexoCpfRgMotorista, setAnexoCpfRgMotorista] = useState<File | undefined>(undefined);
  const [anexoCpfRgMotoristaConj, setAnexoCpfRgMotoristaConj] = useState<File | undefined>(undefined);
  const [anexoEstadoCivil, setAnexoEstadoCivil] = useState<File | undefined>(undefined);
  const [anexoResidencia, setAnexoResidencia] = useState<File | undefined>(undefined);
  const [anexoContratoSocial, setAnexoContratoSocial] = useState<File | undefined>(undefined);

  // Buscar o cardId da URL
  useEffect(() => {
    const idFromParams = searchParams.get("cardId");

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

      setEndereco(data.logradouro);
      setBairro(data.bairro);
      setEstado(data.uf);
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar o CEP. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cep = e.target.value.replace(/-/g, "");
    setCep(cep);
    if (cep.length === 8) buscarCep(cep);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cpfInput = e.target.value.replace(/\D/g, "").substring(0, 11); // Remove não dígitos e limita a 11 caracteres

    if (cpfInput.length > 9) {
      cpfInput = cpfInput.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (cpfInput.length > 6) {
      cpfInput = cpfInput.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
    } else if (cpfInput.length > 3) {
      cpfInput = cpfInput.replace(/(\d{3})(\d{0,3})/, "$1.$2");
    }

    setCpf(cpfInput);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setTipoPessoa(selectedValue);
    setIsPessoaJuridica(selectedValue === "Pessoa jurídica");
  };

  const handleEstadoCivilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setEstadoCivil(selectedValue);
    setIsCasado(selectedValue === "Casado");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardId) {
      toast({
        title: "Erro",
        description: "Card ID não está disponível.",
        variant: "destructive",
      });
      return;
    }

    // Validação dos campos obrigatórios
    if (!nomeCompleto || !email || !telefone || !cpf || !rg || !cep || !estado || !bairro || !endereco || !numero) {
      toast({
        title: "Erro no envio",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // **Validação dos Anexos Obrigatórios**
    if (!anexoCpfRgMotorista) {
      toast({
        title: "Erro no envio",
        description: "Por favor, anexe o CPF, RG ou CNH.",
        variant: "destructive",
      });
      return;
    }

    if (!anexoResidencia) {
      toast({
        title: "Erro no envio",
        description: "Por favor, anexe o comprovante de residência.",
        variant: "destructive",
      });
      return;
    }

    if (isPessoaJuridica && !anexoContratoSocial) {
      toast({
        title: "Erro no envio",
        description: "Por favor, anexe o contrato social.",
        variant: "destructive",
      });
      return;
    }

    // Validação do formato do e-mail
    if (!isValidEmail(email)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    // Validação do CPF
    if (!isValidCPF(cpf)) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido.",
        variant: "destructive",
      });
      return;
    }

    // Validação do RG
    if (rg.length < 5) {
      // Exemplo de validação simples
      toast({
        title: "RG inválido",
        description: "Por favor, insira um RG válido.",
        variant: "destructive",
      });
      return;
    }

    // Validação condicional para Pessoa Jurídica
    if (isPessoaJuridica) {
      if (!cnpj || !razaoSocial) {
        toast({
          title: "Erro no envio",
          description: "Por favor, preencha os campos de CNPJ e Razão Social.",
          variant: "destructive",
        });
        return;
      }

      // Validação do CNPJ
      if (!isValidCNPJ(cnpj)) {
        toast({
          title: "CNPJ inválido",
          description: "Por favor, insira um CNPJ válido.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validação condicional para Casado
    if (isCasado) {
      if (!nomeCompletoConjuge || !cpfConjuge || !rgConjuge || !emailConjuge || !telefoneConjuge) {
        toast({
          title: "Erro no envio",
          description: "Por favor, preencha todos os campos do cônjuge.",
          variant: "destructive",
        });
        return;
      }

      // Validação do e-mail do cônjuge
      if (!isValidEmail(emailConjuge)) {
        toast({
          title: "E-mail do cônjuge inválido",
          description: "Por favor, insira um e-mail válido para o cônjuge.",
          variant: "destructive",
        });
        return;
      }

      // Validação do CPF do cônjuge
      if (!isValidCPF(cpfConjuge)) {
        toast({
          title: "CPF do cônjuge inválido",
          description: "Por favor, insira um CPF válido para o cônjuge.",
          variant: "destructive",
        });
        return;
      }

      // Validação do RG do cônjuge
      if (rgConjuge.length < 5) {
        // Exemplo de validação simples
        toast({
          title: "RG do cônjuge inválido",
          description: "Por favor, insira um RG válido para o cônjuge.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validação de Data de Nascimento
    if (dataNascimento) {
      const hoje = new Date();
      const nascimento = new Date(dataNascimento);
      if (nascimento > hoje) {
        toast({
          title: "Data de nascimento inválida",
          description: "A data de nascimento não pode ser futura.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validação de Data de Nascimento do Cônjuge
    if (isCasado && dataNascimentoConjuge) {
      const hoje = new Date();
      const nascimentoConj = new Date(dataNascimentoConjuge);
      if (nascimentoConj > hoje) {
        toast({
          title: "Data de nascimento do cônjuge inválida",
          description: "A data de nascimento do cônjuge não pode ser futura.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validação de CEP
    if (cep.length !== 8) {
      // Exemplo de validação simples
      toast({
        title: "CEP inválido",
        description: "Por favor, insira um CEP válido com 8 dígitos.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Cria um objeto FormData para enviar os dados e os arquivos
      const formData = new FormData();
      formData.append("cardId", cardId.toString());
      formData.append("tipoPessoa", tipoPessoa);
      formData.append("cnpj", cnpj);
      formData.append("razaoSocial", razaoSocial);
      formData.append("estadoCivil", estadoCivil);
      formData.append("cpfConjuge", cpfConjuge);
      formData.append("rgConjuge", rgConjuge);
      formData.append("nomeCompleto", nomeCompleto);
      formData.append("nomeCompletoConjuge", nomeCompletoConjuge);
      formData.append("email", email);
      formData.append("emailConjuge", emailConjuge);
      formData.append("telefone", telefone);
      formData.append("telefoneConjuge", telefoneConjuge);
      formData.append("nacionalidade", nacionalidade);
      formData.append("nacionalidadeConjuge", nacionalidadeConjuge);
      formData.append("naturalidade", naturalidade);
      formData.append("naturalidadeConjuge", naturalidadeConjuge);
      formData.append("dataNascimento", dataNascimento);
      formData.append("cpf", cpf);
      formData.append("rg", rg);
      formData.append("orgaoExpedidor", orgaoExpedidor);
      formData.append("cep", cep);
      formData.append("estado", estado);
      formData.append("bairro", bairro);
      formData.append("endereco", endereco);
      formData.append("numero", numero);
      formData.append("complemento", complemento);

      // **Anexos Obrigatórios**
      formData.append("anexoCpfRgMotorista", anexoCpfRgMotorista);
      if (isPessoaJuridica && anexoContratoSocial) {
        formData.append("anexoContratoSocial", anexoContratoSocial);
      }

      if (anexoCpfRgMotoristaConj) formData.append("anexoCpfRgMotoristaConj", anexoCpfRgMotoristaConj);
      if (anexoEstadoCivil) formData.append("anexoEstadoCivil", anexoEstadoCivil);
      if (anexoResidencia) formData.append("anexoResidencia", anexoResidencia);

      // Enviar os dados ao backend
      const response = await api.post("/saveProprietarioToCard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Dados enviados",
        description: "Os dados do proprietário foram salvos com sucesso.",
        variant: "default",
      });

      router.push(`/formulariopartedois?cardId=${cardId}`);
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
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
              <label className="block mb-2">Você é pessoa física ou jurídica?</label>
              <div className="relative">
                <select
                  value={tipoPessoa}
                  className="w-full border border-[#ccc] appearance-none rounded-2xl px-10 py-4"
                  onChange={handleSelectChange}
                >
                  <option value="Pessoa física">Pessoa física</option>
                  <option value="Pessoa jurídica">Pessoa jurídica</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ClickSvgIcon className="fill-[#87A644] ml-[10px]" />
                </div>
              </div>
            </div>

            {isPessoaJuridica && (
              <div className="flex w-full gap-4">
                <div className="w-full">
                  <label className="block mb-2">CNPJ</label>
                  <input
                    type="text"
                    value={cnpj}
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite o seu CNPJ"
                    onChange={(e) => setCnpj(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <label className="block mb-2">Razão Social</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite a sua Razão Social"
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="w-full">
              <label className="block mb-2">Nome completo</label>
              <input
                type="text"
                className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                placeholder="Digite o seu nome completo aqui"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
              />
            </div>

            {isCasado && (
              <>
                <div className="w-full">
                  <label className="block mb-2">Nome completo - Cônjuge</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite o nome completo do cônjuge"
                    onChange={(e) => setNomeCompletoConjuge(e.target.value)}
                    value={nomeCompletoConjuge}
                  />
                </div>
                <div className="w-full">
                  <label className="block mb-2">CPF - Cônjuge</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite o CPF do cônjuge"
                    value={cpfConjuge}
                    onChange={(e) => setCpfConjuge(e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <label className="block mb-2">RG - Cônjuge</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite o RG do cônjuge"
                    value={rgConjuge}
                    onChange={(e) => setRgConjuge(e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <label className="block mb-2">E-mail - Cônjuge</label>
                  <input
                    type="email"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite o e-mail do cônjuge"
                    value={emailConjuge}
                    onChange={(e) => setEmailConjuge(e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <label className="block mb-2">Telefone - Cônjuge</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite o telefone do cônjuge"
                    value={telefoneConjuge}
                    onChange={(e) => setTelefoneConjuge(e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <label className="block mb-2">Nacionalidade - Cônjuge</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite a nacionalidade do cônjuge"
                    value={nacionalidadeConjuge}
                    onChange={(e) => setNacionalidadeConjuge(e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <label className="block mb-2">Naturalidade - Cônjuge</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    placeholder="Digite a naturalidade do cônjuge"
                    value={naturalidadeConjuge}
                    onChange={(e) => setNaturalidadeConjuge(e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <label className="block mb-2">Data de nascimento - Cônjuge</label>
                  <input
                    type="date"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    value={dataNascimentoConjuge}
                    onChange={(e) => setDataNascimentoConjuge(e.target.value)}
                  />
                  <span className="text-xs text-gray-400">Coloque a data no formato Mês/Dia/Ano</span>
                </div>
              </>
            )}

            <div className="w-full">
              <label className="block mb-2">E-mail</label>
              <input
                type="email"
                className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                placeholder="Digite o seu email aqui"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label className="block mb-2">Telefone</label>
              <input
                type="text"
                className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                placeholder="(00) 0 0000 0000"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Nacionalidade</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                  placeholder="Qual a sua nacionalidade?"
                  value={nacionalidade}
                  onChange={(e) => setNacionalidade(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">Naturalidade</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                  placeholder="Qual a sua naturalidade?"
                  value={naturalidade}
                  onChange={(e) => setNaturalidade(e.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Estado Civil</label>
                <div className="relative">
                  <select
                    value={estadoCivil}
                    className="w-full border border-[#ccc] appearance-none rounded-2xl px-10 py-4"
                    onChange={handleEstadoCivilChange}
                  >
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
                <label className="block mb-2">Data de nascimento</label>
                <input
                  type="date"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
                <span className="text-xs text-gray-400">Coloque a data no formato Mês/Dia/Ano</span>
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">CPF</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                  placeholder="Digite o seu CPF"
                  value={cpf}
                  onChange={handleCpfChange}
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">RG</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                  placeholder="Digite o seu RG"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">Orgão Expeditor</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                  placeholder="Digite o seu Orgão Expeditor"
                  value={orgaoExpedidor}
                  onChange={(e) => setOrgaoExpedidor(e.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">CEP</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                  placeholder="Digite o seu CEP"
                  value={cep}
                  onChange={handleCepChange}
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">Estado</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
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
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                  placeholder="Digite o seu bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">Endereço</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                  placeholder="Digite o seu endereço"
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
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                  placeholder="Digite o número"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">Complemento</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                  placeholder="Digite o complemento"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>
            </div>

            {/* Inputs de anexo de arquivos */}
            <div className="w-full">
              <label className="block mb-2">Anexar CPF, RG ou Carteira de motorista (Obrigatório)</label>
              <input
                type="file"
                className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                accept="image/*,application/pdf"
                onChange={(e) => setAnexoCpfRgMotorista(e.target.files ? e.target.files[0] : undefined)}
              />
            </div>

            <div className="w-full">
              <label className="block mb-2">Anexar Estado Civil</label>
              <input
                type="file"
                className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                accept="image/*,application/pdf"
                onChange={(e) => setAnexoEstadoCivil(e.target.files ? e.target.files[0] : undefined)}
              />
            </div>

            <div className="w-full">
              <label className="block mb-2">Anexar Comprovante de Residência (Obrigatório)</label>
              <input
                type="file"
                className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                accept="image/*,application/pdf"
                onChange={(e) => setAnexoResidencia(e.target.files ? e.target.files[0] : undefined)}
              />
            </div>
            {isCasado && (
              <>
                <div className="w-full">
                  <label className="block mb-2">Anexar CPF, RG ou Carteira de motorista - Cônjuge</label>
                  <input
                    type="file"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                    accept="image/*,application/pdf"
                    onChange={(e) => setAnexoCpfRgMotoristaConj(e.target.files ? e.target.files[0] : undefined)}
                  />
                </div>
              </>
            )}

            {isPessoaJuridica && (
              <div className="w-full">
                <label className="block mb-2">Anexar Contrato Social</label>
                <input
                  type="file"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                  accept="image/*,application/pdf"
                  onChange={(e) => setAnexoContratoSocial(e.target.files ? e.target.files[0] : undefined)}
                />
              </div>
            )}

            <div className="w-full pb-10">
              <Button className="w-full py-7 mt-4 bg-[#87A644] hover:bg-[#5b702e] text-white" type="submit">
                Enviar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default SecondForm;
