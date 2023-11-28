export interface ResultadoVoto {
  quantidadeAlunosVotantes: number;
  quantidadeAlunosNaoVotantes: number;
  quantidadeFuncionarios: number;
  alunosVotaram: number;
  funcionariosVotaram: number;
  respAlunosVotantesVotaram: number;
  respAlunosNaoVotantesVotaram: number;
  votos: Votos;
}

export interface Votos {
  votosRespAlunosVotantes: VotosAlunosClass;
  votosRespAlunosNaoVotantes: VotosAlunosClass;
  votosAlunos: VotosAlunosClass;
  votosFuncionarios: VotosAlunosClass;
}

export interface VotosAlunosClass {
  candidato_um: number;
  candidato_dois: number;
  branco: number;
  nulo: number;
  [key: string]: number;
}
