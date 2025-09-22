"use client";
import DocslistCard from "@/components/form/DocsListCard";
import { documentsList } from "@/components/form/formsDocsList";
import { useUserContext } from "@/userContext";
import { Avatar, Box, Container, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl } from "@/utils/api";
import { Candidato } from "@/utils/types/candidato.types";

const onSubmit = (data: any) => {
  console.log(data);
  console.log("enviou");
};

export default function DocsCandidato() {
  const { control, handleSubmit } = useForm();
  const { user, setUser } = useUserContext();
  const [candidato, setCandidato] = useState<Candidato>();
  const router = useRouter();
  const [documentsSubmitted, setDocumentsSubmitted] = useState(false);
  const [fotoCandidato, setFotoCandidato] = useState("");

  // const checkDocumentsSubmission = () => {
  //   if (candidato && candidato.docs) {
  //     const totalDocuments = Object.keys(candidato.docs).length;
  //     const submittedDocuments = Object.values(candidato.docs).filter(
  //       (doc) => doc.file && doc.file.length > 0
  //     ).length;

  //     if (submittedDocuments === totalDocuments && totalDocuments > 0) {
  //       setDocumentsSubmitted(true);
  //     } else {
  //       setDocumentsSubmitted(false);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   checkDocumentsSubmission();
  // }, [candidato]);

  // useEffect(() => {
  //   if (documentsSubmitted) {
  //     alert("Todos os documentos foram enviados!");
  //   }
  // }, [documentsSubmitted]);

  useEffect(() => {
    const getDadosCandidato = async (id: string, token: string) => {
      const response = await fetch(
        `${apiUrl}/api/v1/candidato/by-usuario/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseJson = await response.json();
      setCandidato(responseJson.candidato);
      return;
    };
    const token = localStorage.getItem("token");
    if (token && user?._id) {
      getDadosCandidato(user._id, token);
    }
  }, [user?._id]);

  useEffect(() => {
    if (candidato) {
      setFotoCandidato(candidato.foto[0]);
    }
  }, [candidato?.foto]);

  let cpfSemTraco = candidato?.cpf;
  if (cpfSemTraco) {
    cpfSemTraco = cpfSemTraco.replace(".", "");
    cpfSemTraco = cpfSemTraco.replace(".", "");
    cpfSemTraco = cpfSemTraco.replace("-", "");
  }

  console.log(candidato, "candidato");
  console.log(user, "candidato");

  return (
    <Box margin="24px">
      <Container>
        <Typography variant="h4" marginBottom="12px" textAlign="center">
          Documentos do candidato
        </Typography>
        <Paper sx={{ padding: "12px" }}>
          <Box margin="0 12px">
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
            <Box display="flex" justifyContent="center" alignContent="center">
              {/* <Avatar
                alt="User"
                src={`${apiUrl}/fotosCandidato/${cpfSemTraco}/${fotoCandidato}`}
                sx={{
                  width: { xs: 85, sm: 130, md: 150, lg: 175 },
                  height: { xs: 85, sm: 130, md: 150, lg: 175 },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              /> */}
            </Box>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            {candidato ? (
              documentsList.map((document, i) => (
                <DocslistCard
                  candidato={candidato}
                  name={document.name}
                  categoria={document.categoria}
                  linkDoc={document.linkDoc}
                  key={i}
                />
              ))
            ) : (
              <div>Carregando...</div>
            )}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
            ></Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
