"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/userContext";
import { apiUrl } from "@/utils/api";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import { Aluno } from "@/utils/types/aluno.types";
import BadgeIcon from "@mui/icons-material/Badge";
import { Funcionario } from "@/utils/types/funcionario.types";

export default function LiberaVoto() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [liberaAluno, setLiberaAluno] = useState(false);
  const [liberafuncionario, setLiberaFuncionario] = useState(false);
  const [busca, setBusca] = useState("");
  const [showStudant, setShowStudant] = useState(true)
  const [showEmployee, setShowEmpoloyee] = useState(true)

  const { user } = useUserContext();
  const router = useRouter();

  const alunoAdress = "aluno/";
  const funcionarioAdress = "funcionario";

  useEffect(() => {
    //fetch
    const token = localStorage.getItem("token");
    if (user._id) {
      //   setIsloading(true);
      const getDados = async () => {
        //`${apiUrl}/api/v1/funcionario/funcionariozona`,
        const response = await fetch(
          `${apiUrl}/api/v1/${liberaAluno ? alunoAdress : funcionarioAdress}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseJson = await response.json();

        if (liberaAluno) {
          setAlunos(responseJson.alunos);
          return response;
        }

        if (liberafuncionario) {
          setFuncionarios(responseJson.funcionarios);
          return response;
        }
      };

      getDados();
    }
  }, [liberaAluno, liberafuncionario]);

  const handleAluno = () => {
    console.log("clicou");
    setLiberaAluno(true);
    setLiberaFuncionario(false);
    setShowEmpoloyee(false)
    setShowStudant(true)
  };

  const dadosAlunos = alunos.find((aluno) => aluno.nome === busca);

  const handleFuncionario = () => {
    setLiberaFuncionario(true);
    setLiberaAluno(false);
    setShowStudant(false)
    setShowEmpoloyee(true)
  };

  const dadosFuncionarios = funcionarios.find(
    (funcionario) => funcionario.nome === busca
  );

  return (
    <>
      <Box
        marginTop={8}
        padding={8}
        overflow="hidden"
        display="flex"
        justifyContent="center"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          <Box
            display="flex"
            gap={12}
            justifyContent="center"
            alignItems="center"
            mb={8}
          >
            <Button
              size="large"
              variant="contained"
              startIcon={<EscalatorWarningIcon style={{ fontSize: 48 }} />}
              onClick={handleAluno}
            >
              Liberar voto de aluno/responsável
            </Button>
            <Button
              size="large"
              variant="outlined"
              startIcon={<BadgeIcon style={{ fontSize: 48 }} />}
              onClick={handleFuncionario}
            >
              Liberar voto de funcionário
            </Button>
          </Box>
          {liberaAluno && (
            <Box>
              <Autocomplete
                id="combo-box-demo"
                options={alunos}
                getOptionLabel={(aluno: Aluno) => aluno.nome}
                onInputChange={(e, newValue) => setBusca(newValue)}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Alunos" />
                )}
              />
            </Box>
          )}

          {liberafuncionario && (
            <Box margin={2}>
              <Autocomplete
                id="combo-box"
                options={funcionarios}
                getOptionLabel={(funcionario: Funcionario) => funcionario.nome}
                inputValue={busca}
                onInputChange={(_, newValue) => setBusca(newValue)}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Funcionarios" />
                )}
              />
            </Box>
          )}
        </Box>
      </Box>

      {dadosAlunos && showStudant && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box display="flex" m={1} flexDirection="column" alignItems="center">
            <Box display="flex" alignItems="center">
              <Box marginRight={3}>
                <Typography padding={2}>NOME: {dadosAlunos?.nome}</Typography>
              </Box>
              <Box>
                {dadosAlunos.votante && !dadosAlunos.aluno_votou && (
                  <Button
                    variant="outlined"
                    onClick={() =>
                      router.push(
                        `${apiUrl}/aluno/api/v1/id/${dadosAlunos._id}`
                      )
                    }
                  >
                    <Typography>Liberar</Typography>
                  </Button>
                )}
              </Box>

              <Box bgcolor="yellow">
                <Typography color="red">
                  {!dadosAlunos.votante
                    ? "ALUNO(A) NÃO PODE VOTAR!"
                    : dadosAlunos.aluno_votou
                      ? "ALUNO(A) JÁ VOTOU!"
                      : undefined}
                </Typography>
              </Box>
            </Box>

            <Box m={1} display="flex" alignItems="center">
              <Typography marginRight={4}>
                RESPONSAVEL 1: {dadosAlunos?.responsavel1}
              </Typography>

              {!dadosAlunos.resp_votou && (
                <Button
                  variant="outlined"
                  onClick={() =>
                    router.push(
                      `/dashboard/votacao?tipo=responsavel&id=${dadosAlunos._id}`
                    )
                  }
                >
                  <Typography>Liberar</Typography>
                </Button>
              )}
            </Box>

            <Box m={1} display="flex" alignItems="center">
              {
                <Typography marginRight={4}>
                  RESPONSAVEL 2: {dadosAlunos?.responsavel2}
                </Typography>
              }
              {!dadosAlunos.resp_votou && (
                <Button
                  variant="outlined"
                  onClick={() =>
                    router.push(
                      `/dashboard/votacao?tipo=responsavel&id=${dadosAlunos._id}`
                    )
                  }
                >
                  <Typography>Liberar</Typography>
                </Button>
              )}
            </Box>

            {dadosAlunos.responsavel3 && (
              <Box m={1} display="flex" alignItems="flex-end">
                <Typography marginRight={4}>
                  RESPONSAVEL 3: {dadosAlunos?.responsavel3}
                </Typography>

                {!dadosAlunos.resp_votou && (
                  <Button
                    variant="outlined"
                    onClick={() =>
                      router.push(
                        `/dashboard/votacao?tipo=responsavel&id=${dadosAlunos._id}`
                      )
                    }
                  >
                    <Typography>Liberar</Typography>
                  </Button>
                )}
              </Box>
            )}

            {dadosAlunos.resp_votou && (
              <Box bgcolor="yellow">
                <Typography color="red">
                  {" "}
                  UM DOS RESPONSÁVEIS JÁ VOTOU{" "}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {dadosFuncionarios && showEmployee && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography>NOME: {dadosFuncionarios?.nome}</Typography>

          <Box m={1}>
            <Typography>CARGO: {dadosFuncionarios?.cargo}</Typography>
          </Box>

          {!dadosFuncionarios.votou && (
            <Button
              variant="contained"
              onClick={() =>
                router.push(
                  `/dashboard/votacao?tipo=funcionario&id=${dadosFuncionarios._id}`
                )
              }
            >
              <Typography>Liberar</Typography>
            </Button>
          )}

          {dadosFuncionarios.votou && (
            <Box bgcolor="yellow">
              <Typography color="red">FUNCIONÁRIO(A) JÁ VOTOU </Typography>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
