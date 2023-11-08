"use client";
import { apiUrl } from "@/utils/api";
import { Candidato } from "@/utils/types/candidato.types";
import {
  Box,
  Button,
  Container,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React, { SyntheticEvent, ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RotatingLines } from "react-loader-spinner";
import FindInPageIcon from "@mui/icons-material/FindInPage";

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

export default function RecursoPage({ params }: { params: { id: string } }) {
  const [candidato, setCandidato] = useState<Candidato>();
  const [candidatoDigitou, setCandidatoDigitou] = useState(false);
  const [textoRecurso, setTextoRecurso] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [buttonColor, setButtonColor] = useState<"success" | "primary">(
    candidato?.docs.doc_recurso?.file ? "success" : "primary"
  );
  useEffect(() => {
    if (candidato) {
      setFileLink(candidato.docs.doc_recurso?.file);
    }
  }, [candidato, candidato?.docs]);

  const [fileLink, setFileLink] = useState("");

  const router = useRouter();

  useEffect(() => {
    const getDadosCandidato = async (id: string, token: string) => {
      const response = await fetch(
        `${apiUrl}/api/v1/candidato/candidatoId/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseJson = await response.json();
      setCandidato(responseJson.candidato);
      setHasDoc(!!responseJson.candidato?.docs.doc_recurso?.file);
      return;
    };
    const token = localStorage.getItem("token");
    if (token) {
      getDadosCandidato(params.id, token);
    }
  }, [params.id]);

  const [hasDoc, setHasDoc] = useState(false);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileLoaded = e.target.files[0];
      const formData = new FormData();
      formData.append("file", fileLoaded);

      //fetch
      fetch(
        `${apiUrl}/api/v1/candidato/docs/${candidato?._id}?cpf=${candidato?.cpf}&categoria=doc_recurso`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          method: "PUT",
          body: formData,
        }
      )
        .then(async (res) => {
          const resJSON = await res.json();
          setFileLink(resJSON.candidato.docs.doc_recurso.file);
          setIsLoading(false);
          alert("Envio concluído");
          setButtonColor("success");
          router.refresh();
          setHasDoc(true);
        })
        .catch((error) => {
          alert("Falha no envio do documento!");
          setIsLoading(false);
          router.refresh();
          console.log(error);
        });
    }
  };

  const handleSubmit = async (data: any) => {
    const token = localStorage.getItem("token");
    data.preventDefault();

    try {
      const response = await fetch(
        `${apiUrl}/api/v1/candidato/${candidato?._id}`,
        {
          method: "PUT",
          body: JSON.stringify({ textoRecurso }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Recurso enviado com sucesso");
        router.push("/dashboard");
      } else {
        alert("Não foi possível concluir o envio do recurso, tente novamente");
        router.refresh();
      }
    } catch (error) {
      alert("Ocorreu um erro na solicitação, tente novamente");
      console.log(error);
      router.refresh();
    }
  };

  useEffect(() => {
    if (candidato) {
      if (candidato.textoRecurso !== "") {
        setTextoRecurso(candidato.textoRecurso);
      }
    }
  }, [candidato]);

  let cpfSemTraco = candidato?.cpf;
  if (cpfSemTraco) {
    cpfSemTraco = cpfSemTraco.replace(".", "");
    cpfSemTraco = cpfSemTraco.replace(".", "");
    cpfSemTraco = cpfSemTraco.replace("-", "");
  }

  return (
    <Box margin="24px">
      <Container>
        <Typography variant="h3" marginBottom="12px" textAlign="center">
          Recurso do Candidato
        </Typography>
        <Box margin="12px 12px">
          <Typography variant="h6">
            Unidade de ensino:{" "}
            <span style={{ fontWeight: "normal", fontSize: "1rem" }}>
              {candidato?.zona?.nome}
            </span>
          </Typography>
          <Typography variant="h6">
            Nome do candidato(a)/indicado(a):{" "}
            <span style={{ fontWeight: "normal", fontSize: "1rem" }}>
              {candidato?.nome}
            </span>
          </Typography>
          <Typography variant="h6">
            Justificativa da Comissão Eleitoral Municipal para indeferimento da
            candidatura:{" "}
            <span style={{ fontWeight: "normal", fontSize: "1rem" }}>
              {candidato?.justificativa}
            </span>
          </Typography>
        </Box>
        {/* <div
          style={{
            height: "645px",
            width: "100%",
            background: "#fff",
          }}
        >
        </div> */}
        <form onSubmit={handleSubmit}>
          <Box
            marginTop="24px"
            display="flex"
            alignItems="center"
            bgcolor="#fff"
          >
            <TextField
              label="Texto do recurso"
              multiline
              rows={8}
              fullWidth
              value={textoRecurso}
              onChange={(e) => {
                setTextoRecurso(e.target.value);
                if (e.target.value.length > 0) {
                  setCandidatoDigitou(true);
                } else {
                  setCandidatoDigitou(false);
                }
              }}
            />
          </Box>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              marginTop="24px"
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {hasDoc && (
                  <Tooltip title="Documento enviado">
                    <Button
                      href={`${apiUrl}/fotosCandidato/${cpfSemTraco}/${fileLink}`}
                      target="_blank"
                    >
                      <FindInPageIcon color="success" />
                    </Button>
                  </Tooltip>
                )}
              </div>
              {/* {candidatoDigitou && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    component="label"
                    color={buttonColor}
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Escolha o documento
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => handleOnChange(e)}
                    />
                  </Button>
                  <Typography
                    variant="caption"
                    display="block"
                    gutterBottom
                    marginTop="4px"
                    textAlign="center"
                  >
                    O upload de arquivo é opcional.
                  </Typography>
                  {isLoading && (
                    <RotatingLines
                      strokeColor="grey"
                      strokeWidth="4"
                      animationDuration="0.75"
                      width="28"
                      visible={true}
                    />
                  )}
                </div>
              )} */}
              <Box marginTop="16px">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!candidatoDigitou}
                >
                  Enviar recurso
                </Button>
              </Box>
            </Box>
          </div>
        </form>
      </Container>
    </Box>
  );
}