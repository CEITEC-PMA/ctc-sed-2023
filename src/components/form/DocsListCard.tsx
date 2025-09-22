import {
  Box,
  Button,
  Grid,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { ChangeEvent, useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/utils/api";
import { RotatingLines } from "react-loader-spinner";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Candidato } from "@/utils/types/candidato.types";

interface Doc {
  file: string;
  original_file: string;
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

interface ButtonColor {}

export default function DocslistCard({
  name,
  categoria,
  linkDoc,
  candidato,
}: {
  name: string;
  categoria: string;
  linkDoc: string;
  candidato: Candidato;
}) {
  // const isBeforeDeadline = useTimeCheck();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonColor, setButtonColor] = useState<"success" | "primary">(
    candidato.docs[categoria]?.file ? "success" : "primary"
  );
  const [fileLink, setFileLink] = useState("");

  const [hasDoc, setHasDoc] = useState(!!candidato.docs[categoria]?.file);

  useEffect(() => {
    setFileLink(candidato.docs[categoria]?.file);
  }, [candidato.docs, categoria]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsLoading(true);
      const fileLoaded = e.target.files[0];
      const formData = new FormData();
      formData.append("file", fileLoaded);
      fetch(
        `${apiUrl}/api/v1/candidato/docs/${candidato._id}?cpf=${candidato.cpf}&categoria=${categoria}`,
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
          setFileLink(resJSON.candidato.docs[categoria].file);
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

  let cpfSemTraco = candidato.cpf;
  if (cpfSemTraco) {
    cpfSemTraco = cpfSemTraco.replace(".", "");
    cpfSemTraco = cpfSemTraco.replace(".", "");
    cpfSemTraco = cpfSemTraco.replace("-", "");
  }

  return (
    <Grid>
      <Paper elevation={2} sx={{ padding: "6px", margin: "12px" }}>
        <Box
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          padding="8px"
        >
          <Box margin="8px">
            <Typography variant="body1">{name}</Typography>
          </Box>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="center"
            marginLeft="12px"
            gap="12px"
          >
            <Tooltip title="Link/modelo do documento solicitado">
              <Button href={linkDoc} target="_blank">
                <AttachFileIcon color="primary" />
              </Button>
            </Tooltip>
            {hasDoc ? (
              <Tooltip title="Documento enviado">
                <Button
                  href={`${apiUrl}/fotosCandidato/${cpfSemTraco}/${fileLink}`}
                  target="_blank"
                >
                  <FindInPageIcon color="success" />
                </Button>
              </Tooltip>
            ) : (
              ""
            )}
            {isLoading && (
              <RotatingLines
                strokeColor="grey"
                strokeWidth="4"
                animationDuration="0.75"
                width="28"
                visible={true}
              />
            )}

            <Button
              component="label"
              color={buttonColor}
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ whiteSpace: "nowrap" }}
            >
              Escolher Arquivo
              <VisuallyHiddenInput
                onChange={(e) => handleOnChange(e)}
                type="file"
              />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}
