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
  Autocomplete,
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

interface ZonaOption {
  _id: string;
  nome: string;
  inep: string;
}

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
  const [zonas, setZonas] = useState<ZonaOption[]>([]);
  const [isAlreadyCandidate, setIsAlreadyCandidate] = useState(false);
  const router = useRouter();

  const formatDateForInput = (
    dateString: string | null | undefined
  ): string => {
    if (!dateString) {
      return "";
    }
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!token || !user?._id) return;

      try {
        // Fetch Zonas first
        const zonasRes = await fetch(`${apiUrl}/api/v1/zona`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (zonasRes.ok) {
          const zonasData = await zonasRes.json();
          if (zonasData.zona) {
            setZonas(zonasData.zona);
          }
        } else {
          console.error("Failed to fetch zonas");
        }

        // Fetch user data
        const userRes = await fetch(`${apiUrl}/api/v1/usuarios/me/complete`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.usuario) {
            setUser((prev) => ({ ...prev, ...userData.usuario }));
            setValue("nome", userData.usuario.nome || "");
            setValue("cpf", userData.usuario.cpf || "");
            setValue("email", userData.usuario.email || "");
            setValue("telefone", userData.usuario.telefone || "");
          }
        } else {
          console.error("Failed to fetch user data");
        }

        // Fetch candidate data
        const candidatoRes = await fetch(
          `${apiUrl}/api/v1/candidato/by-usuario/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (candidatoRes.ok) {
          const candidatoData = await candidatoRes.json();
          if (candidatoData.candidato) {
            setIsAlreadyCandidate(true);
            const {
              matricula,
              cargo,
              funcao,
              curso_gestor,
              data_entrada_modulacao,
              data_inicio_docencia,
              zona_pleito,
              foto,
              cpf,
            } = candidatoData.candidato;

            setValue("matricula", matricula || "");
            setValue("cargo", cargo || "");
            setValue("funcao", funcao || "");
            setValue("curso_gestor", curso_gestor || "");
            setValue(
              "data_entrada_modulacao",
              formatDateForInput(data_entrada_modulacao)
            );
            setValue(
              "data_inicio_docencia",
              formatDateForInput(data_inicio_docencia)
            );
            setValue("zona_pleito", zona_pleito?._id || zona_pleito || "");

            if (foto && foto.length > 0) {
              const cpfSemTraco = cpf.replace(/\./g, "").replace("-", "");
              setFotoPreview(
                `${apiUrl}/fotosCandidato/${cpfSemTraco}/${foto[0]}`
              );
            }
          }
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
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
      const response = await fetch(`${apiUrl}/api/v1/candidato/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Falha ao criar a candidatura.");

      alert("Candidatura criada com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao criar candidatura:", error);
      alert("Erro ao criar a candidatura.");
    }
  };

  return (
    <>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Formulário de Inscrição de Candidato
      </Typography>
      <Paper sx={{ p: { xs: 2, md: 4 }, m: { xs: 1, md: 2 } }}>
        {isAlreadyCandidate && (
          <Typography color="error" textAlign="center" sx={{ my: 2 }}>
            Você já possui uma candidatura registrada. Os dados abaixo são para
            visualização.
          </Typography>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={2}
            display="flex"
            flexDirection="column"
            borderRadius={2}
          >
            <Grid p={2}>
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
                  sx={{
                    width: 150,
                    height: 150,
                    border: "1px solid lightgray",
                  }}
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

            <Grid
              alignContent="center"
              justifyContent="center"
              display="flex"
              gap={2}
              flexDirection={{ xs: "column", md: "row" }}
            >
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
            </Grid>

            <Grid
              alignContent="center"
              justifyContent="center"
              display="flex"
              gap={2}
              flexDirection={{ xs: "column", md: "row" }}
            >
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
            </Grid>

            <Grid alignContent="center" display="flex" justifyContent="center">
              <Controller
                name="zona_pleito"
                control={control}
                rules={{ required: "Zona do Pleito é obrigatória" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Autocomplete
                    options={zonas}
                    getOptionLabel={(option) =>
                      option.nome && option.inep
                        ? `${option.nome} - INEP: ${option.inep}`
                        : ""
                    }
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    value={zonas.find((z) => z._id === value) || null}
                    onChange={(e, newValue) => {
                      onChange(newValue ? newValue._id : null);
                    }}
                    onBlur={onBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Zona do Pleito"
                        required
                        sx={{ width: 500 }}
                        error={!!errors.zona_pleito}
                        helperText={errors.zona_pleito?.message}
                        inputRef={ref}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid
              alignContent="center"
              justifyContent="center"
              display="flex"
              gap={2}
              flexDirection={{ xs: "column", md: "row" }}
            >
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
                <FormControl
                  sx={{ minWidth: 200 }}
                  required
                  error={!!errors.cargo}
                >
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
            </Grid>

            <Grid
              alignContent="center"
              justifyContent="center"
              display="flex"
              gap={2}
              flexDirection={{ xs: "column", md: "row" }}
            >
              <Grid>
                <FormControl
                  sx={{ maxWidth: 300, minWidth: 180 }}
                  required
                  error={!!errors.curso_gestor}
                >
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
                    <FormHelperText>
                      {errors.curso_gestor.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid>
                <Controller
                  name="data_entrada_modulacao"
                  control={control}
                  rules={{
                    required: "Data é obrigatória",
                    validate: (value) =>
                      !isNaN(Date.parse(value)) || "Data inválida",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Data Entrada Modulação"
                      type="date"
                      sx={{ maxWidth: 300, minWidth: 180 }}
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
                  rules={{
                    required: "Data é obrigatória",
                    validate: (value) =>
                      !isNaN(Date.parse(value)) || "Data inválida",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Data Início Docência"
                      type="date"
                      sx={{ maxWidth: 300, minWidth: 180 }}
                      required
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.data_inicio_docencia}
                      helperText={errors.data_inicio_docencia?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid sx={{ textAlign: "center", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isAlreadyCandidate}
              >
                Salvar Dados
                <SaveIcon style={{ marginLeft: 8 }} />
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
}
