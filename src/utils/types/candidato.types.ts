export interface Candidato {
  aprovado: string;
  curso_gestor: string;
  foto: string[];
  docs: { [key: string]: Doc };
  deletado: boolean;
  _id: string;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  funcao: string;
  matricula: number;
  data_entrada_inst: Date;
  data_entrada_docencia: Date;
  tempo_modulacao: string;
  tempo_docencia: string;
  protocolo: string;
  zona: Zona;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Doc {
  file: string;
  original_file: string;
}

export interface Zona {
  role: string[];
  acesso: number;
  hash: string;
  salt: string;
  deletado: boolean;
  _id: string;
  nome: string;
  inep: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}