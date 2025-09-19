"use client";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { ChangeEvent, useEffect, useState } from "react";
import { apiUrl } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/userContext";
import { PatternFormat } from "react-number-format";
import SaveIcon from "@mui/icons-material/Save";

export type CandidatoFormInputs = {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  matricula: string;
  cargo: string;
  funcao: string;
  curso_gestor: string;
  data_entrada_modulacao: string;
  data_inicio_docencia: string;
  zona_pleito: string;
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

const cargoOptions = [
  "Professor",
  "Diretor",
  "Coordenador Pedagógico",
  "Coordenador Geral",
  "Coordenador Técnico",
];

export default function CandidatoForm() {
  const { user, setUser } = useUserContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CandidatoFormInputs>({
    mode: "onBlur",
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      matricula: "",
      cargo: "",
      funcao: "",
      curso_gestor: "",
      data_entrada_modulacao: "",
      data_inicio_docencia: "",
      zona_pleito: "",
    },
  });

  const [token, setToken] = useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    setToken(localToken);

    const fetchUserData = async () => {
      if (!localToken || !user?._id) return;

      try {
        const response = await fetch(`${apiUrl}/api/v1/usuarios/me/complete`, {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        });
        if (!response.ok)
          throw new Error("Failed to fetch complete user data.");
        const data = await response.json();
        if (data.usuario) {
          setUser((prevUser) => ({
            ...prevUser,
            ...data.usuario,
          }));

          setValue("nome", data.usuario.nome || "");
          setValue("cpf", data.usuario.cpf || "");
          setValue("email", data.usuario.email || "");
          setValue("telefone", data.usuario.telefone || "");
        }
      } catch (error) {
        console.error("Error fetching complete user data:", error);
      }
    };

    fetchUserData();
  }, [user?._id, token, setValue, setUser]);

  const handleFotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user?._id && token) {
      const file = e.target.files[0];
      setFotoPreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          `${apiUrl}/api/v1/candidato/images/${user._id}?cpf=${user.cpf}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            method: "PUT",
            body: formData,
          }
        );
        if (!response.ok) throw new Error("Falha no upload da foto.");
        const result = await response.json();
        alert("Foto enviada com sucesso!");
      } catch (error) {
        console.error("Erro no upload da foto:", error);
        alert("Erro ao enviar a foto.");
      }
    }
  };

  const onSubmit: SubmitHandler<CandidatoFormInputs> = async (data) => {
    if (!user?._id || !token) {
      alert("Usuário não autenticado.");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/v1/candidato/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Falha ao salvar os dados.");

      alert("Cadastro de candidato atualizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar os dados do candidato.");
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, m: { xs: 1, md: 2 } }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Formulário de Inscrição de Candidato
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid bgcolor={"#f5f5f5"} p={2} borderRadius={2}>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                my: 2,
              }}
            >
              <Typography variant="h6">Foto do Candidato</Typography>
              <Avatar
                src={fotoPreview || undefined}
                sx={{ width: 150, height: 150, border: "1px solid lightgray" }}
              >
                {!fotoPreview && "Preview"}
              </Avatar>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Enviar Foto (JPG)
                <VisuallyHiddenInput
                  type="file"
                  accept=".jpg, .jpeg"
                  onChange={handleFotoChange}
                />
              </Button>
            </Grid>
          </Grid>

          <Grid>
            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome Completo"
                  fullWidth
                  disabled
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <PatternFormat
                  {...field}
                  format="###.###.###-##"
                  mask="_"
                  customInput={TextField}
                  label="CPF"
                  fullWidth
                  disabled
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  disabled
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="telefone"
              control={control}
              render={({ field }) => (
                <PatternFormat
                  {...field}
                  format="(##)#####-####"
                  mask="_"
                  customInput={TextField}
                  label="Telefone"
                  disabled
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid>
            <Controller
              name="matricula"
              control={control}
              rules={{ required: "Matrícula é obrigatória" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Matrícula"
                  fullWidth
                  required
                  error={!!errors.matricula}
                  helperText={errors.matricula?.message}
                />
              )}
            />
          </Grid>

          <Grid>
            <FormControl fullWidth required error={!!errors.cargo}>
              <InputLabel>Cargo</InputLabel>
              <Controller
                name="cargo"
                control={control}
                rules={{ required: "Cargo é obrigatório" }}
                render={({ field }) => (
                  <Select {...field} label="Cargo">
                    {cargoOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.cargo && (
                <FormHelperText>{errors.cargo.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid>
            <Controller
              name="funcao"
              control={control}
              rules={{ required: "Função é obrigatória" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Função"
                  fullWidth
                  required
                  error={!!errors.funcao}
                  helperText={errors.funcao?.message}
                />
              )}
            />
          </Grid>

          <Grid>
            <FormControl fullWidth required error={!!errors.curso_gestor}>
              <InputLabel>Curso de Gestor</InputLabel>
              <Controller
                name="curso_gestor"
                control={control}
                rules={{ required: "Campo obrigatório" }}
                render={({ field }) => (
                  <Select {...field} label="Curso de Gestor">
                    <MenuItem value="SIM">SIM</MenuItem>
                    <MenuItem value="NÃO">NÃO</MenuItem>
                  </Select>
                )}
              />
              {errors.curso_gestor && (
                <FormHelperText>{errors.curso_gestor.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid>
            <Controller
              name="data_entrada_modulacao"
              control={control}
              rules={{ required: "Data é obrigatória" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Data Entrada Modulação"
                  type="date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.data_entrada_modulacao}
                  helperText={errors.data_entrada_modulacao?.message}
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="data_inicio_docencia"
              control={control}
              rules={{ required: "Data é obrigatória" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Data Início Docência"
                  type="date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.data_inicio_docencia}
                  helperText={errors.data_inicio_docencia?.message}
                />
              )}
            />
          </Grid>

          <Grid>
            <Controller
              name="zona_pleito"
              control={control}
              rules={{ required: "Zona do Pleito é obrigatória" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Zona do Pleito"
                  fullWidth
                  required
                  error={!!errors.zona_pleito}
                  helperText={errors.zona_pleito?.message}
                />
              )}
            />
          </Grid>

          <Grid sx={{ textAlign: "center", mt: 2 }}>
            <Button type="submit" variant="contained" size="large">
              Salvar Inscrição
              <SaveIcon style={{ marginLeft: 8 }} />
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
