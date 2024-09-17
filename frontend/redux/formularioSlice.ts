import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enviarFormularioCompleto } from "./formularioThunks";

interface ImovelState {
  tipoImovelSelecionado: string;
  valorAluguel: string | null;
  valorIptu: string | null;
  valorCondominio: string | null;
  valorGas: string | null;
  planoSelecionado: string;
  valorMensal: number;
  taxaSetup: number;
}

interface ProprietarioState {
  tipoPessoa: string;
  cnpj?: string;
  razaoSocial?: string;
  estadoCivil: string;
  cpfConjuge?: string;
  nomeCompleto: string;
  nomeCompletoConjuge?: string;
  email: string;
  telefone: string;
  nacionalidade: string;
  naturalidade: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  orgaoExpedidor: string;
  emailConjuge?: string;
  telefoneConjuge?: string;
  nacionalidadeConjuge?: string;
  naturalidadeConjuge?: string;
  dataNascimentoConjuge?: string;
  rgConjuge?: string;
  orgaoExpedidorConjuge?: string;
  cep: string;
  estado: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento?: string;
  anexoCpfRgMotorista?: File;
  anexoCpfRgMotoristaConj?: File;
  anexoEstadoCivil?: File;
  anexoResidencia?: File;
  anexoContratoSocial?: File;
}

interface ImovelDetalhesState {
  finalidade: string;
  tipoImovel: string;
  valorAluguel: string | null;
  valorCondominio: string | null;
  valorIptu: string | null;
  valorAgua?: string | null;
  valorGas?: string | null;
  administradorNome?: string;
  administradorTelefone?: string;
  cepImovel: string;
  cidade: string;
  estado: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento?: string;
  anexoCondominio?: File;
  anexoIptu?: File;
  anexoAgua?: File;
  anexoLuz?: File;
  anexoEscritura?: File;
}

interface LocatarioState {
  tipoPessoa: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  nacionalidade: string;
  naturalidade: string;
  estadoCivil: string;
  dataNascimento: string;
  cpf?: string;
  rg?: string;
  orgaoExpedidor?: string;
  cnpj?: string;
  razaoSocial?: string;
  cep: string;
  estado: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento?: string;
  anexoCpfRgMotoristaLocatario?: File;
  anexoEstadoCivilLocatario?: File;
  anexoResidenciaLocatario?: File;
  anexoContratoSocialLocatario?: File;
  anexoUltimoBalancoLocatario?: File;
}

interface FormState {
  imovel: ImovelState | null;
  proprietario: ProprietarioState | null;
  imovelDetalhes: ImovelDetalhesState | null;
  locatario: LocatarioState | null;
}

const initialState: FormState = {
  imovel: null,
  proprietario: null,
  imovelDetalhes: null,
  locatario: null,
};

const formularioSlice = createSlice({
  name: "formulario",
  initialState,
  reducers: {
    // Actions para armazenar os dados do Imóvel
    setImovelData(state, action: PayloadAction<ImovelState>) {
      state.imovel = action.payload;
    },
    // Actions para armazenar os dados do Proprietário
    setProprietarioData(state, action: PayloadAction<ProprietarioState>) {
      state.proprietario = action.payload;
    },
    // Actions para armazenar os dados do ImóvelDetalhes
    setImovelDetalhesData(state, action: PayloadAction<ImovelDetalhesState>) {
      state.imovelDetalhes = action.payload;
    },
    // Actions para armazenar os dados do Locatario
    setLocatarioData(state, action: PayloadAction<LocatarioState>) {
      state.locatario = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(enviarFormularioCompleto.fulfilled, (state, action) => {
        console.log("Formulário enviado com sucesso:", action.payload);
      })
      .addCase(enviarFormularioCompleto.rejected, (state, action) => {
        console.error("Erro ao enviar formulário:", action.error);
      });
  },
});

export const { setImovelData, setProprietarioData, setImovelDetalhesData, setLocatarioData } = formularioSlice.actions;

export default formularioSlice.reducer;
