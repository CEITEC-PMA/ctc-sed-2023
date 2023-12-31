"use client";
import { useUserContext } from "@/userContext";
import { apiUrl } from "@/utils/api";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Aluno } from "@/utils/types/aluno.types";
import DescriptionIcon from "@mui/icons-material/Description";
import html2pdf from "html2pdf.js";

const GetContainer = ({ aluno }: { aluno: Aluno }) => {
  return (
    <Grid container sx={{ border: "1px solid black" }}>
      <Grid item xs={12}>
        <Typography sx={{ fontSize: "12px", textAlign: "center" }}>
          <b>
            {aluno?.nome?.substring(0, 30)} - {aluno.serie}
          </b>
        </Typography>
      </Grid>
      <Grid item container>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: "10px", textAlign: "center" }}>
            {aluno?.responsavel1 ? aluno?.responsavel1?.substring(0, 30) : "-"}
          </Typography>
          <Typography sx={{ fontSize: "10px", textAlign: "center" }}>
            Responsável 1
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: "10px", textAlign: "center" }}>
            {aluno?.responsavel2 ? aluno?.responsavel2?.substring(0, 30) : "-"}
          </Typography>
          <Typography sx={{ fontSize: "10px", textAlign: "center" }}>
            Responsável 2
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: "10px", textAlign: "center" }}>
            {aluno?.responsavel3 ? aluno?.responsavel3?.substring(0, 30) : "-"}
          </Typography>
          <Typography sx={{ fontSize: "10px", textAlign: "center" }}>
            Responsável 3
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: "10px", textAlign: "center" }}>
            ______________________________________
          </Typography>
          <Typography sx={{ fontSize: "10px", textAlign: "center" }}>
            Assinatura Responsável
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default function AtaAlunosNaoVotantes(props: {
  pagina: number;
  arrayAlunos: any[];
}) {
  const { pagina, arrayAlunos } = props;
  const { user } = useUserContext();
  const [alunos, setAlunos] = useState([] as Aluno[]);

  useEffect(() => {
    //fetch
    const token = localStorage.getItem("token");
    if (user._id) {
      const getDadosAlunos = async () => {
        const response = await fetch(`${apiUrl}/api/v1/aluno/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const responseJson = await response.json();

        setAlunos(responseJson.alunos);
        return response;
      };
      getDadosAlunos();
    }
  }, [user._id]);

  const generatePDF = () => {
    const opt = {
      filename: `ataAlunosNaoVotantespt${pagina + 1}`,
    };
    // Choose the element that our invoice is rendered in.
    const element = document.getElementById("printAlunosNaoVotantes" + pagina);
    if (element) {
      // clone the element
      var clonedElement = element.cloneNode(true) as HTMLElement;

      // change display of cloned element
      clonedElement.style.display = "block";

      // Choose the clonedElement and save the PDF for our user.
      html2pdf(clonedElement, opt);

      // remove cloned element
      clonedElement.remove();
    }
  };

  return (
    <div>
      <Button
        size="large"
        variant="contained"
        onClick={generatePDF}
        startIcon={<DescriptionIcon style={{ fontSize: 48 }} />}
        // onClick={handleAluno}
      >
        ATA DE ALUNOS NÃO VOTANTES PT {pagina + 1}
      </Button>
      <Container
        id={"printAlunosNaoVotantes" + pagina}
        sx={{ display: "none" }}
      >
        {arrayAlunos.map((pagina: any, i: number) => {
          return (
            <Box
              key={`paginaAluno-${i}`}
              sx={{ pageBreakAfter: "always", paddingTop: 2 }}
            >
              <Container sx={{ textAlign: "center", marginBottom: 1 }}>
                <Image
                  src="https://cdn.anapolis.go.gov.br/img/logos/sem_fundo/azuis/educacao.png"
                  alt="logo"
                  height={50}
                  width={250}
                />
              </Container>
              <Typography align="center" variant="h5" sx={{ fontSize: "16px" }}>
                {user.nome}
              </Typography>
              <Typography align="center" variant="h5" sx={{ fontSize: "16px" }}>
                Lista de Alunos-não-votantes - Eleição Diretores Biênio 2024/25
              </Typography>
              {pagina.map((aluno: Aluno, i: number) => {
                return <GetContainer aluno={aluno} key={`tableAluno-${i}`} />;
              })}
            </Box>
          );
        })}
      </Container>
    </div>
  );
}
