"use client";
import { colors, colors1 } from "@/utils/colors";
import { Candidato } from "@/utils/types/candidato.types";
import { NumerosVotacao } from "@/utils/types/numerosVotacao.type";
import { ResultadoFinalEleicao } from "@/utils/types/resultadoFinal.types";
import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Text,
  Tooltip,
} from "recharts";

export default function VotacaoResp(props: {
  candidatos: Candidato[];
  numerosVotacao: NumerosVotacao;
  resultadoEleicao: ResultadoFinalEleicao;
}) {
  const { candidatos } = props;
  const { numerosVotacao } = props;
  const { resultadoEleicao } = props;

  const data01 = [
    {
      name: "Responsáveis de alunos-não-votantes que não votaram",
      value:
        numerosVotacao.quantidadeAlunosNaoVotantes -
        numerosVotacao.respAlunosNaoVotantesVotaram,
    },
    {
      name: "Responsáveis de alunos-não-votantes que já votaram",
      value: numerosVotacao.respAlunosNaoVotantesVotaram,
    },
  ];

  const data02 = candidatos.map((candidato, i) => {
    const votosCandidato =
      (resultadoEleicao?.confirmaPercentual[i].qtdeVotosRespAlunosNaoVotantes
        .numero_votos *
        100) /
      numerosVotacao.respAlunosNaoVotantesVotaram;

    const votosCandidatoArredondado = parseFloat(votosCandidato.toFixed(2));
    const nomeCandidato =
      resultadoEleicao?.confirmaPercentual[i].qtdeVotosRespAlunosNaoVotantes
        .nome_candidato;

    return {
      name: nomeCandidato,
      value: votosCandidatoArredondado,
    };
  });

  const data03 = [
    {
      name: "Responsáveis de alunos-votantes que não votaram",
      value:
        numerosVotacao.quantidadeAlunosVotantes -
        numerosVotacao.respAlunosVotantesVotaram,
    },
    {
      name: "Responsáveis de alunos-votantes que já votaram",
      value: numerosVotacao.respAlunosVotantesVotaram,
    },
  ];

  const data04 = candidatos.map((candidato, i) => {
    const votosCandidato =
      (resultadoEleicao?.confirmaPercentual[i].qtdeVotosRespAlunosVotantes
        .numero_votos *
        100) /
      numerosVotacao.respAlunosVotantesVotaram;

    const votosCandidatoArredondado = parseFloat(votosCandidato.toFixed(2));
    const nomeCandidato =
      resultadoEleicao?.confirmaPercentual[i].qtdeVotosRespAlunosVotantes
        .nome_candidato;

    return {
      name: nomeCandidato,
      value: votosCandidatoArredondado,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignContent: "center",
        }}
      >
        {numerosVotacao.quantidadeAlunosNaoVotantes !== 0 && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text x={0} y={15} width={300} textAnchor="middle">
                Total de responsáveis de alunos-não-votantes
              </Text>
              <PieChart width={380} height={380}>
                <Pie
                  data={data01}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {data01.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors1[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip formatter={(value, name, props) => [value, name]} />
              </PieChart>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text x={0} y={15} width={300} textAnchor="middle">
                Votos dos responsáveis de alunos-não-votantes (%)
              </Text>
              <PieChart width={380} height={380}>
                <Pie
                  data={data02}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {data02.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${Number(value).toFixed(2)}%`,
                    name,
                  ]}
                />
              </PieChart>
            </div>
          </>
        )}

        {numerosVotacao.quantidadeAlunosVotantes !== 0 && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text x={0} y={15} width={300} textAnchor="middle">
                Total de responsáveis de alunos-votantes
              </Text>
              <PieChart width={380} height={380}>
                <Pie
                  data={data03}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {data03.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors1[index % colors1.length]}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip formatter={(value, name, props) => [value, name]} />
              </PieChart>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text x={0} y={15} width={300} textAnchor="middle">
                Votos dos responsáveis de alunos-votantes (%)
              </Text>
              <PieChart width={380} height={380}>
                <Pie
                  data={data04}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {data04.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${Number(value).toFixed(2)}%`,
                    name,
                  ]}
                />
              </PieChart>
            </div>
          </>
        )}
      </div>
    </ResponsiveContainer>
  );
}
