import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api"; // Ajuste o caminho para o seu serviço de API
import { RootState } from "./store";

export const enviarFormularioCompleto = createAsyncThunk(
  "formulario/enviarFormularioCompleto",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { imovel, proprietario, imovelDetalhes, locatario } = state.formulario;

    const formData = new FormData();

    // Adicionando arquivos ao FormData
    if (locatario?.anexoCpfRgMotoristaLocatario) {
      formData.append("anexoCpfRgMotoristaLocatario", locatario.anexoCpfRgMotoristaLocatario);
    }
    if (locatario?.anexoEstadoCivilLocatario) {
      formData.append("anexoEstadoCivilLocatario", locatario.anexoEstadoCivilLocatario);
    }
    if (locatario?.anexoResidenciaLocatario) {
      formData.append("anexoResidenciaLocatario", locatario.anexoResidenciaLocatario);
    }
    if (locatario?.anexoContratoSocialLocatario) {
      formData.append("anexoContratoSocialLocatario", locatario.anexoContratoSocialLocatario);
    }
    if (locatario?.anexoUltimoBalancoLocatario) {
      formData.append("anexoUltimoBalancoLocatario", locatario.anexoUltimoBalancoLocatario);
    }

    // Adicionando dados em formato JSON ao FormData
    if (imovel) formData.append("imovel", JSON.stringify(imovel));
    if (proprietario) formData.append("proprietario", JSON.stringify(proprietario));
    if (imovelDetalhes) formData.append("imovelDetalhes", JSON.stringify(imovelDetalhes));

    if (locatario) {
      const {
        anexoCpfRgMotoristaLocatario,
        anexoEstadoCivilLocatario,
        anexoResidenciaLocatario,
        anexoContratoSocialLocatario,
        anexoUltimoBalancoLocatario,
        ...restLocatario
      } = locatario;
      formData.append("locatario", JSON.stringify(restLocatario));
    }

    try {
      const response = await api.post("/cards", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue("Erro ao enviar formulário");
    }
  }
);
