"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import FormBuilder from "../form/FormBuilder";
import { registerDTOs } from "@/utils/dtos/registerDTOs";
import { Avatar, Button, Paper, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { ChangeEvent, useEffect, useState } from "react";
import { apiUrl } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Candidato } from "@/utils/types/candidato.types";
import { getDadosCandidato } from "@/actions/getDadosCandidato";

export type CandidatoInputs = {
  cpf: string;
  nome: string;
  matricula: string;
  telefone: string;
  email: string;
  funcao: string;
  cargo: string;
  curso_gestor: string;
  data_entrada_inst: string;
  data_entrada_docencia: string;
  obs_curso_gestor: string;
  zona?: string;
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function CandidatoRegister({ id }: { id: string }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CandidatoInputs>({ mode: "onBlur" });

  const [candidato, setCandidato] = useState({
    foto: [],
  } as unknown as Candidato);
  const [token, setToken] = useState("" as string | null);
  const router = useRouter();
  const [fotoCandidato, setFotoCandidato] = useState("");

  const onSubmit: SubmitHandler<CandidatoInputs> = async (data) => {
    const toDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    };
    data.data_entrada_inst = toDate(data.data_entrada_inst);
    data.data_entrada_docencia = toDate(data.data_entrada_docencia);
    const response = await fetch(
      `${apiUrl}/api/v1/candidato/${candidato._id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  function converterData(dataOriginal: string) {
    // Criar um objeto Date a partir da data original
    const data = new Date(dataOriginal);

    // Extrair o dia, mês e ano da data
    const dia = data.getDate();
    const mes = data.getMonth() + 1; // Lembre-se de que os meses em JavaScript são indexados a partir de 0, então adicionamos 1.
    const ano = data.getFullYear();

    // Formatar a data no formato desejado
    const dataFormatada = `${dia.toString().padStart(2, "0")}/${mes
      .toString()
      .padStart(2, "0")}/${ano}`;

    return dataFormatada;
  }

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    setToken(localToken);
    getDadosCandidato(id, localToken, setCandidato);
  }, [id, token]);

  useEffect(() => {
    setFotoCandidato(candidato.foto[0]);
  }, [candidato.foto]);

  // console.log(candidato.foto);

  useEffect(() => {
    if (candidato.nome) {
      const dataInst = new Date(candidato.data_entrada_inst).toLocaleDateString(
        "pt-BR",
        { timeZone: "UTC" }
      );
      const dataDocencia = new Date(
        candidato.data_entrada_docencia
      ).toLocaleDateString("pt-BR", { timeZone: "UTC" });
      setValue("nome", candidato.nome);
      setValue("cpf", candidato.cpf);
      setValue("matricula", candidato.matricula);
      setValue("email", candidato.email);
      setValue("telefone", candidato.telefone);
      setValue("funcao", candidato.funcao);
      setValue("cargo", candidato.cargo);
      setValue("curso_gestor", candidato.curso_gestor);
      setValue("data_entrada_inst", dataInst);
      setValue("data_entrada_docencia", dataDocencia);
    }
  }, [candidato, setValue]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileLoaded = e.target.files[0];
      const formData = new FormData();
      formData.append("file", fileLoaded);

      //fetch
      fetch(
        `${apiUrl}/api/v1/candidato/images/${candidato._id}?cpf=${candidato.cpf}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          method: "PUT",
          body: formData,
        }
      ).then(async (res) => {
        const resJSON = await res.json();
        setFotoCandidato(resJSON.candidato.foto[0]);
        router.refresh();
      });
    }
  };
  let cpfSemTraco = candidato.cpf;
  if (cpfSemTraco) {
    cpfSemTraco = cpfSemTraco.replace(".", "");
    cpfSemTraco = cpfSemTraco.replace(".", "");
    cpfSemTraco = cpfSemTraco.replace("-", "");
  }

  const formBuilderDTO = {
    formDTOs: registerDTOs,
    onSubmit,
    control,
    handleSubmit,
    errors,
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, m: { xs: 1, md: 2 } }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4" textAlign="center">
            Formulário de Inscrição de Candidato
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {cpfSemTraco && (
            <Avatar
              alt="User"
              src={`${apiUrl}/fotosCandidato/${cpfSemTraco}/${fotoCandidato}`}
              sx={{
                width: { xs: 120, sm: 150, md: 175 },
                height: { xs: 120, sm: 150, md: 175 },
              }}
            />
          )}

          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Foto do candidato
            <VisuallyHiddenInput
              onChange={(e) => handleOnChange(e)}
              type="file"
            />
          </Button>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormBuilder formBuilderDTO={formBuilderDTO} />
        </Grid>
      </Grid>
    </Paper>
  );
}
