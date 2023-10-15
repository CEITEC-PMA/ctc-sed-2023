"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import FormBuilder from "../form/FormBuilder";
import { registerDTOs } from "@/utils/dtos/registerDTOs";
import { Avatar, Button, Grid, Paper, Typography } from "@mui/material";
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

  const onSubmit: SubmitHandler<CandidatoInputs> = async (data) => {
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

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    setToken(localToken);
    getDadosCandidato(id, localToken, setCandidato);
  }, [id, token]);

  useEffect(() => {
    if (candidato.nome) {
      setValue("nome", candidato.nome);
      setValue("cpf", candidato.cpf);
      setValue("matricula", candidato.matricula);
      setValue("email", candidato.email);
      setValue("telefone", candidato.telefone);
      setValue("funcao", candidato.funcao);
      setValue("cargo", candidato.cargo);
      setValue("curso_gestor", candidato.curso_gestor);
      setValue("data_entrada_inst", candidato.data_entrada_inst);
      setValue("data_entrada_docencia", candidato.data_entrada_docencia);
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
      ).then(() => {
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
    <Paper elevation={2}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        bgcolor="#fff"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item container>
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "16px",
              marginBottom: "8px",
            }}
            xs={12}
          >
            <Typography variant="h4" textAlign="center">
              Cadastro de candidato
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "8px",
            }}
            xs={12}
          >
            <Avatar
              alt="User"
              src={`${apiUrl}/fotosCandidato/${cpfSemTraco}/${candidato.foto[0]}`}
              sx={{
                width: { xs: 85, sm: 130, md: 150, lg: 175 },
                height: { xs: 85, sm: 130, md: 150, lg: 175 },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "10px",
              }}
            />
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
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormBuilder formBuilderDTO={formBuilderDTO} />
        </Grid>
      </Grid>
    </Paper>
  );
}
