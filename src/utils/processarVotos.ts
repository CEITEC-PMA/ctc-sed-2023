import { ResultadoVoto } from "./types/resultado.types";

const qtdeVotos = {
  quantidadeAlunosVotantes: 100,
  quantidadeAlunosNaoVotantes: 100,
  quantidadeFuncionarios: 100,
  alunosVotaram: 100,
  funcionariosVotaram: 49,
  respAlunosVotantesVotaram: 100,
  respAlunosNaoVotantesVotaram: 100,
  votos: {
    votosRespAlunosVotantes: {
      candidato_um: 35,
      candidato_dois: 50,
      branco: 10,
      nulo: 5,
    },
    votosRespAlunosNaoVotantes: {
      candidato_um: 25,
      candidato_dois: 50,
      branco: 15,
      nulo: 10,
    },
    votosAlunos: {
      candidato_um: 40,
      candidato_dois: 50,
      branco: 6,
      nulo: 4,
    },
    votosFuncionarios: {
      candidato_um: 40,
      candidato_dois: 50,
      branco: 7,
      nulo: 3,
    },
  },
};

const passouQuorum = (qtdeVotos: ResultadoVoto) => {
  const {
    quantidadeFuncionarios,
    funcionariosVotaram,
    alunosVotaram,
    quantidadeAlunosVotantes,
    respAlunosNaoVotantesVotaram,
    quantidadeAlunosNaoVotantes,
  } = qtdeVotos;
  const percentualFunc = (funcionariosVotaram / quantidadeFuncionarios) * 100;
  const percentualAlunos = (alunosVotaram / quantidadeAlunosVotantes) * 100;
  const percentualPais =
    (respAlunosNaoVotantesVotaram / quantidadeAlunosNaoVotantes) * 100;

  const quorumFunc = {
    percentual: percentualFunc,
    result: percentualFunc < 50 ? false : true,
  };
  const quorumAlunos = {
    percentual: percentualAlunos,
    result: percentualAlunos < 50 ? false : true,
  };

  const quorumPais = {
    percentual: percentualPais,
    result: percentualPais < 20 ? false : true,
  };

  let resultGeral = true;
  const quorunsNaoAtingidos = [];

  if (!quorumFunc.result) {
    resultGeral = false;
    quorunsNaoAtingidos.push("Quórum de funcionários não atingido.");
  }
  if (!quorumAlunos.result) {
    resultGeral = false;
    quorunsNaoAtingidos.push("Quórum de alunos não atingido.");
  }
  if (!quorumPais.result) {
    resultGeral = false;
    quorunsNaoAtingidos.push("Quórum de pais/responsáveis não atingido.");
  }

  return {
    quorumFunc,
    quorumAlunos,
    quorumPais,
    quorunsNaoAtingidos,
    resultGeral,
  };
};

const percentualVotos = (qtdeVotos: ResultadoVoto) => {
  const { votos } = qtdeVotos;
  const {
    votosRespAlunosVotantes,
    votosRespAlunosNaoVotantes,
    votosAlunos,
    votosFuncionarios,
  } = votos;

  const arrayDeCandidatos = Object.keys(votosAlunos);

  const qtdeVotosCandidato = arrayDeCandidatos.map((candidato) => {
    const qtdeVotosRespAlunosVotantes = votosRespAlunosVotantes[candidato];
    const qtdeVotosRespAlunosNaoVotantes =
      votosRespAlunosNaoVotantes[candidato];
    const qtdeVotosAlunos = votosAlunos[candidato];
    const qtdeVotosFuncionarios = votosFuncionarios[candidato];

    const somaPaisAlunos =
      qtdeVotosRespAlunosNaoVotantes +
      qtdeVotosAlunos +
      qtdeVotosRespAlunosVotantes;

    const percentualRespAlunos =
      (somaPaisAlunos * 50) /
      (qtdeVotos.quantidadeAlunosNaoVotantes +
        qtdeVotos.quantidadeAlunosVotantes +
        qtdeVotos.quantidadeAlunosVotantes);

    const percentualFunc =
      (qtdeVotosFuncionarios * 50) / qtdeVotos.quantidadeFuncionarios;

    const percentualTotal = percentualRespAlunos + percentualFunc;

    return {
      candidato,
      somaPaisAlunos,
      qtdeVotosFuncionarios,
      percentualTotal,
    };
  });
  return qtdeVotosCandidato;
};

const resultadoFinal = (qtdeVotos: ResultadoVoto) => {
  const confirmaQuorum = passouQuorum(qtdeVotos);
  const confirmaPercentual = percentualVotos(qtdeVotos);

  let candidatoApto = true;
  let candidatoEleito = "";
  const motivosIndeferimento = [];

  const candidatosDisputando = confirmaPercentual.filter(
    (percentual) =>
      percentual.candidato !== "branco" && percentual.candidato !== "nulo"
  );

  const initialValue = 0;
  const somaPercentualCandidatos = candidatosDisputando.reduce(
    (accumulator, currentValue) => accumulator + currentValue.percentualTotal,
    initialValue
  );

  if (somaPercentualCandidatos <= 50) {
    candidatoApto = false;
    motivosIndeferimento.push({
      tipo: "Percentual",
      motivos: ["Percentual não atingido."],
    });
  }

  if (!confirmaQuorum.resultGeral) {
    candidatoApto = false;
    motivosIndeferimento.push({
      tipo: "Quórum",
      motivos: confirmaQuorum.quorunsNaoAtingidos,
    });
  }

  if (confirmaQuorum.resultGeral && somaPercentualCandidatos > 50) {
    let percentualMaior = 0;

    confirmaPercentual.forEach((percentual) => {
      if (percentual.percentualTotal > percentualMaior) {
        percentualMaior = percentual.percentualTotal;
        candidatoEleito = percentual.candidato;
      }
    });
  }
  return { candidatoApto, candidatoEleito, motivosIndeferimento };
};

console.log(JSON.stringify(resultadoFinal(qtdeVotos)));
