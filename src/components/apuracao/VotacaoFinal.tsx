import { Candidato } from "@/utils/types/candidato.types";
import { NumerosVotacao } from "@/utils/types/numerosVotacao.type";
import { ResultadoFinalEleicao } from "@/utils/types/resultadoFinal.types";
import { Typography } from "@mui/material";
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

type MotivoRenderizado = {
  tipo: string;
  motivos: string[];
};

export default function VotacaoFinal(props: {
  candidatos: Candidato[];
  numerosVotacao: NumerosVotacao;
  resultadoEleicao: ResultadoFinalEleicao;
}) {
  const { candidatos } = props;
  const { numerosVotacao } = props;
  const { resultadoEleicao } = props;
  const colors = ["#227487", "#4EA3B7", "#104A57", "#F4DEB2", "#00A9B5"];

  const data01 = candidatos.map((candidato, i) => {
    const votosCandidato =
      resultadoEleicao?.confirmaPercentual[i].qtdeVotosAlunos;
    const nomeCandidato = resultadoEleicao?.confirmaPercentual[i].candidato;

    return {
      name: nomeCandidato,
      value: votosCandidato,
    };
  });

  let motivosRenderizados: MotivoRenderizado[] = [];

  if (
    resultadoEleicao.hasOwnProperty("motivosIndeferimento") &&
    Array.isArray(resultadoEleicao.motivosIndeferimento) &&
    resultadoEleicao.motivosIndeferimento.length > 0
  ) {
    motivosRenderizados = resultadoEleicao.motivosIndeferimento.map(
      (motivo) => {
        const tipo = motivo.tipo;
        const motivos = motivo.motivos;

        return {
          tipo,
          motivos,
        };
      }
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignContent: "center",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text x={0} y={15} width={300} textAnchor="middle">
            Total geral de votos (%)
          </Text>
          <PieChart width={400} height={400}>
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
        {resultadoEleicao.candidatoApto && (
          <Typography>
            Com {resultadoEleicao.percentualMaior}% dos votos, o/a candidato(a)
            vencedor foi {resultadoEleicao.candidatoEleito}!
          </Typography>
        )}
        {!resultadoEleicao.candidatoApto && (
          <Typography>
            A eleição não teve um candidato apto a vencê-la. Estes foram os
            motivos:{" "}
            {motivosRenderizados.map((motivo, index) => (
              <React.Fragment key={index}>
                <span>{motivo.tipo}: </span>
                <span>{motivo.motivos.join(", ")}</span>
                <br />
              </React.Fragment>
            ))}
          </Typography>
        )}
      </div>
    </ResponsiveContainer>
  );
}